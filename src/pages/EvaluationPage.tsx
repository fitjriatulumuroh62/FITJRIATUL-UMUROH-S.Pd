import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Play,
  RotateCcw,
  Save,
  XCircle,
} from 'lucide-react';
import { INDICATOR_LABELS } from '../data/literacyData';
import { EVALUATION_QUESTIONS } from '../data/questionsData';
import { SHAPES_BY_ID } from '../data/shapesData';
import {
  EvaluationAttempt,
  LiteracyIndicator,
  MenuId,
  QuestionItem,
  ShapeId,
  StudentIdentity,
} from '../types/learning';
import { EvaluationDraft } from '../utils/storage';

interface EvaluationPageProps {
  student: StudentIdentity;
  onUpdateStudent: (next: StudentIdentity) => void;
  draft: EvaluationDraft;
  onUpdateDraft: (next: EvaluationDraft) => void;
  onCompleteEvaluation: (attempt: EvaluationAttempt) => void;
  latestAttempt: EvaluationAttempt | null;
  onNavigate: (menu: MenuId) => void;
}

function normalizeNum(raw: string): number {
  const cleaned = raw.replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
  return Number(cleaned);
}

function isAnswerCorrect(q: QuestionItem, ans: string | undefined): boolean {
  if (!ans || !ans.trim()) return false;
  if (q.type === 'multiple_choice') return ans === String(q.correctAnswer);
  const val = normalizeNum(ans);
  if (Number.isNaN(val)) return false;
  return Math.abs(val - Number(q.correctAnswer)) <= (q.tolerance ?? 0.01);
}

export function EvaluationPage({
  student,
  onUpdateStudent,
  draft,
  onUpdateDraft,
  onCompleteEvaluation,
  latestAttempt,
  onNavigate,
}: EvaluationPageProps) {
  const [nameInput, setNameInput] = useState(student.name);
  const [codeInput, setCodeInput] = useState(student.code);
  const [confirmFinishOpen, setConfirmFinishOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const questions = EVALUATION_QUESTIONS;
  const totalQ = questions.length;
  const currentIdx = Math.min(draft.currentIndex, totalQ - 1);
  const currentQ = questions[currentIdx];

  const answeredCount = questions.filter(
    (q) => (draft.answers[q.id] ?? '').trim().length > 0,
  ).length;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      name: nameInput.trim() || 'Peserta Didik Kelas VI',
      code: codeInput.trim() || 'ARJ-06',
    });
    setShowReview(false);
    onUpdateDraft({
      started: true,
      currentIndex: 0,
      answers: {},
      lastSavedAt: new Date().toLocaleTimeString('id-ID'),
    });
  };

  const handleSelectAnswer = (val: string) => {
    onUpdateDraft({
      ...draft,
      answers: { ...draft.answers, [currentQ.id]: val },
      lastSavedAt: new Date().toLocaleTimeString('id-ID'),
    });
  };

  const handleJump = (idx: number) => {
    onUpdateDraft({
      ...draft,
      currentIndex: idx,
    });
  };

  const handleFinishConfirmed = () => {
    setConfirmFinishOpen(false);
    const breakdown: Record<LiteracyIndicator, { correct: number; total: number }> = {
      memahami: { correct: 0, total: 0 },
      merumuskan: { correct: 0, total: 0 },
      menggunakan: { correct: 0, total: 0 },
      menafsirkan: { correct: 0, total: 0 },
      mengevaluasi: { correct: 0, total: 0 },
    };

    const missedShapesSet = new Set<ShapeId>();
    let correctCount = 0;

    questions.forEach((q) => {
      breakdown[q.indicator].total += 1;
      const ok = isAnswerCorrect(q, draft.answers[q.id]);
      if (ok) {
        correctCount += 1;
        breakdown[q.indicator].correct += 1;
      } else {
        missedShapesSet.add(q.shape);
      }
    });

    const score = Math.round((correctCount / totalQ) * 100);
    const attempt: EvaluationAttempt = {
      completedAt: new Date().toISOString(),
      answers: { ...draft.answers },
      score,
      correctCount,
      totalQuestions: totalQ,
      indicatorBreakdown: breakdown,
      missedShapes: Array.from(missedShapesSet),
    };

    onCompleteEvaluation(attempt);
    setShowReview(true);
  };

  // Post-evaluation results & full review screen
  if (!draft.started && showReview && latestAttempt) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-1">
                Evaluasi Selesai · {student.name} ({student.code})
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Hasil Evaluasi Literasi Matematis
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-sky-600 text-white px-6 py-3 text-center">
                <p className="text-xs font-semibold opacity-90">Nilai Akhir</p>
                <p className="text-3xl font-extrabold tabular-nums">
                  {latestAttempt.score}
                </p>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-bold text-emerald-700 tabular-nums">
                  Benar: {latestAttempt.correctCount} soal
                </p>
                <p className="font-bold text-amber-800 tabular-nums">
                  Salah: {latestAttempt.totalQuestions - latestAttempt.correctCount} soal
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown per 5 literacy indicators */}
          <div className="pt-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Ringkasan Kemampuan per Indikator Literasi Matematis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(Object.keys(INDICATOR_LABELS) as LiteracyIndicator[]).map((ind) => {
                const stat = latestAttempt.indicatorBreakdown[ind];
                const pct =
                  stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                return (
                  <div
                    key={ind}
                    className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
                  >
                    <p className="text-xs font-bold text-slate-700 mb-1">
                      {INDICATOR_LABELS[ind]}
                    </p>
                    <p className="text-xl font-extrabold text-sky-700 tabular-nums">
                      {pct}%
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {stat.correct} dari {stat.total} benar
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('hasil')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Buka Halaman Hasil Belajar & Ekspor</span>
            </button>
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-800 text-sm font-bold hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Kerjakan Evaluasi Lagi</span>
            </button>
          </div>
        </div>

        {/* Full Discussion of All 12 Questions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pembahasan Setiap Soal Evaluasi
          </h2>
          {questions.map((q, idx) => {
            const userAns = latestAttempt.answers[q.id] || '';
            const ok = isAnswerCorrect(q, userAns);
            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <span>Soal {idx + 1}</span>
                    <span>·</span>
                    <span>{SHAPES_BY_ID[q.shape].name}</span>
                    <span>·</span>
                    <span>{INDICATOR_LABELS[q.indicator]}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      ok ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {ok ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>{ok ? 'Jawaban Benar' : 'Perlu Perbaikan'}</span>
                  </span>
                </div>

                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="block text-xs font-semibold text-slate-500">
                      Jawaban Kamu
                    </span>
                    <span className="font-bold text-slate-900">
                      {userAns ? `${userAns} ${q.unit || ''}` : 'Tidak dijawab'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                    <span className="block text-xs font-semibold text-emerald-700">
                      Jawaban Tepat
                    </span>
                    <span className="font-bold text-emerald-950">
                      {String(q.correctAnswer)} {q.unit || ''}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-sky-50/70 border border-sky-100 p-4 space-y-1.5 text-sm text-slate-700">
                  <p>
                    <strong>Memahami:</strong> {q.steps.memahami}
                  </p>
                  <p>
                    <strong>Merumuskan:</strong> {q.steps.merumuskan}
                  </p>
                  <p>
                    <strong>Menggunakan:</strong> {q.steps.menggunakan}
                  </p>
                  <p>
                    <strong>Menafsirkan:</strong> {q.steps.menafsirkan}
                  </p>
                  <p>
                    <strong>Mengevaluasi:</strong> {q.steps.mengevaluasi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Start Evaluation Screen
  if (!draft.started) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-sky-700 font-semibold text-sm">
            <ClipboardCheck className="w-5 h-5" />
            <span>Evaluasi Akhir · SDN Arjasa 01</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Evaluasi Literasi Matematis
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Evaluasi ini terdiri dari <strong>{totalQ} soal cerita kontekstual</strong> yang mengukur kelima kemampuan literasi matematis: memahami, merumuskan, menggunakan, menafsirkan, dan mengevaluasi hasil. Jawabanmu tersimpan otomatis selama pengerjaan.
          </p>

          <form onSubmit={handleStart} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eval-name"
                  className="block text-xs font-bold text-slate-600 mb-1"
                >
                  Nama Peserta Didik
                </label>
                <input
                  id="eval-name"
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="eval-code"
                  className="block text-xs font-bold text-slate-600 mb-1"
                >
                  Kode / Nomor Absen
                </label>
                <input
                  id="eval-code"
                  type="text"
                  required
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-600 text-white text-base font-bold hover:bg-sky-700 transition-colors cursor-pointer"
              >
                <Play className="w-5 h-5" />
                <span>Mulai Evaluasi ({totalQ} Soal)</span>
              </button>

              {latestAttempt && (
                <button
                  type="button"
                  onClick={() => setShowReview(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  <span>Lihat Pembahasan Terakhir (Nilai {latestAttempt.score})</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Active Evaluation Session
  const currentAnswer = draft.answers[currentQ.id] ?? '';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Status Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Peserta Didik: <strong className="text-slate-900">{student.name}</strong> ({student.code})
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
            Soal {currentIdx + 1} dari {totalQ}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Save className="w-4 h-4" />
            <span>
              Tersimpan otomatis{draft.lastSavedAt ? ` (${draft.lastSavedAt})` : ''}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setConfirmFinishOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Selesaikan Evaluasi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 pb-3 border-b border-slate-100">
            <span className="text-sky-700 font-bold">{currentQ.contextLabel}</span>
            <span>·</span>
            <span>{SHAPES_BY_ID[currentQ.shape].name}</span>
            <span>·</span>
            <span>Indikator: {INDICATOR_LABELS[currentQ.indicator]}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h2>

          {currentQ.type === 'multiple_choice' && currentQ.options ? (
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const selected = currentAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectAnswer(opt)}
                    className={`w-full flex items-start gap-3 text-left p-4 rounded-2xl border-2 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-sky-50 border-sky-600 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        selected
                          ? 'bg-sky-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <label
                htmlFor={`eval-input-${currentQ.id}`}
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Ketik Jawabanmu (Angka)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`eval-input-${currentQ.id}`}
                  type="text"
                  inputMode="decimal"
                  value={currentAnswer}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="Ketik angka..."
                  className="w-48 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg font-mono font-bold text-slate-900 focus:border-sky-600"
                />
                {currentQ.unit && (
                  <span className="text-base font-bold text-slate-700">
                    {currentQ.unit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleJump(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Soal Sebelumnya</span>
            </button>

            {currentIdx < totalQ - 1 ? (
              <button
                type="button"
                onClick={() => handleJump(currentIdx + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 cursor-pointer"
              >
                <span>Simpan & Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmFinishOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 cursor-pointer"
              >
                <span>Selesaikan Evaluasi</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Navigasi Nomor Soal</h3>
            <span className="text-xs font-bold text-sky-700 tabular-nums">
              {answeredCount}/{totalQ} terisi
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const filled = (draft.answers[q.id] ?? '').trim().length > 0;
              const isCurr = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJump(idx)}
                  className={`h-11 rounded-xl border text-sm font-bold tabular-nums cursor-pointer transition-colors ${
                    isCurr
                      ? 'bg-sky-600 text-white border-sky-600'
                      : filled
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hijau menandakan soal sudah terisi jawaban. Kamu bebas melompat ke nomor mana saja sebelum menekan tombol Selesaikan Evaluasi.
          </p>
        </aside>
      </div>

      {/* Inline Confirm Modal (never window.confirm) */}
      {confirmFinishOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-finish-title"
        >
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 id="confirm-finish-title" className="text-xl font-bold text-slate-900">
              Selesaikan Evaluasi Sekarang?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kamu telah menjawab <strong className="tabular-nums">{answeredCount} dari {totalQ}</strong> soal.
              {answeredCount < totalQ &&
                ' Masih ada soal yang belum diisi, tetapi kamu tetap bisa melihat nilai dan pembahasannya setelah selesai.'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmFinishOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm font-bold hover:bg-slate-200 cursor-pointer"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                onClick={handleFinishConfirmed}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 cursor-pointer"
              >
                Ya, Lihat Hasil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
