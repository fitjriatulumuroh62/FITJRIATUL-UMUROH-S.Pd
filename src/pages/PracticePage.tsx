import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { INDICATOR_LABELS } from '../data/literacyData';
import { PRACTICE_QUESTIONS } from '../data/questionsData';
import { SHAPES_BY_ID, SHAPES_LIST } from '../data/shapesData';
import {
  DifficultyLevel,
  PracticeRecord,
  QuestionItem,
  ShapeId,
} from '../types/learning';

interface PracticePageProps {
  practiceRecord: PracticeRecord;
  onSaveAnswer: (questionId: string, userAnswer: string, isCorrect: boolean) => void;
  onResetPractice: () => void;
  onOpen3D: (shape: ShapeId) => void;
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  mudah: 'Mudah',
  sedang: 'Sedang',
  menantang: 'Menantang',
};

function normalizeNumberInput(raw: string): number {
  const cleaned = raw.replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
  return Number(cleaned);
}

function checkQuestionAnswer(q: QuestionItem, userInput: string): boolean {
  if (!userInput.trim()) return false;
  if (q.type === 'multiple_choice') {
    return userInput === String(q.correctAnswer);
  }
  const num = normalizeNumberInput(userInput);
  if (Number.isNaN(num)) return false;
  const target = Number(q.correctAnswer);
  const tol = q.tolerance ?? 0.01;
  return Math.abs(num - target) <= tol;
}

export function PracticePage({
  practiceRecord,
  onSaveAnswer,
  onResetPractice,
  onOpen3D,
}: PracticePageProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'semua'>('semua');
  const [filterShape, setFilterShape] = useState<ShapeId | 'semua'>('semua');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<
    Record<string, { checked: boolean; isCorrect: boolean; showSteps: boolean }>
  >({});

  const filteredQuestions = useMemo(() => {
    return PRACTICE_QUESTIONS.filter((q) => {
      if (filterDifficulty !== 'semua' && q.difficulty !== filterDifficulty) return false;
      if (filterShape !== 'semua' && q.shape !== filterShape) return false;
      return true;
    });
  }, [filterDifficulty, filterShape]);

  const safeIdx = Math.min(currentIdx, Math.max(0, filteredQuestions.length - 1));
  const currentQ = filteredQuestions[safeIdx];

  const totalAnswered = Object.keys(practiceRecord.answeredIds).length;
  const totalCorrect = Object.values(practiceRecord.answeredIds).filter(
    (x) => x.isCorrect,
  ).length;

  const handleFilterChange = (
    diff: DifficultyLevel | 'semua',
    shape: ShapeId | 'semua',
  ) => {
    setFilterDifficulty(diff);
    setFilterShape(shape);
    setCurrentIdx(0);
  };

  const currentDraft = currentQ
    ? draftInputs[currentQ.id] ??
      practiceRecord.answeredIds[currentQ.id]?.userAnswer ??
      ''
    : '';
  const currentFeedback = currentQ ? feedbackMap[currentQ.id] : undefined;

  const handleCheck = () => {
    if (!currentQ || !currentDraft.trim()) return;
    const isCorrect = checkQuestionAnswer(currentQ, currentDraft);
    onSaveAnswer(currentQ.id, currentDraft, isCorrect);
    setFeedbackMap((prev) => ({
      ...prev,
      [currentQ.id]: {
        checked: true,
        isCorrect,
        showSteps: isCorrect ? true : prev[currentQ.id]?.showSteps ?? false,
      },
    }));
  };

  const handleToggleSteps = () => {
    if (!currentQ) return;
    setFeedbackMap((prev) => ({
      ...prev,
      [currentQ.id]: {
        checked: prev[currentQ.id]?.checked ?? false,
        isCorrect: prev[currentQ.id]?.isCorrect ?? false,
        showSteps: !(prev[currentQ.id]?.showSteps ?? false),
      },
    }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Header & Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-sky-700 mb-1">
              Latihan Soal Cerita Kontekstual · {PRACTICE_QUESTIONS.length} Soal Interaktif
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Latihan Literasi Matematis
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm">
              <span className="text-slate-500 font-medium">Dikerjakan: </span>
              <span className="font-bold text-slate-900 tabular-nums">
                {totalAnswered} / {PRACTICE_QUESTIONS.length}
              </span>
              <span className="mx-2 text-slate-300">·</span>
              <span className="text-slate-500 font-medium">Benar: </span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {totalCorrect}
              </span>
            </div>
            {totalAnswered > 0 && (
              <button
                type="button"
                onClick={() => {
                  onResetPractice();
                  setFeedbackMap({});
                  setDraftInputs({});
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Latihan</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">Tingkat Kesulitan</p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['semua', 'Semua'],
                  ['mudah', 'Mudah'],
                  ['sedang', 'Sedang'],
                  ['menantang', 'Menantang'],
                ] as [DifficultyLevel | 'semua', string][]
              ).map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleFilterChange(val, filterShape)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    filterDifficulty === val
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">Bangun Ruang</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleFilterChange(filterDifficulty, 'semua')}
                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  filterShape === 'semua'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semua Bangun
              </button>
              {SHAPES_LIST.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleFilterChange(filterDifficulty, s.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    filterShape === s.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
          <p className="text-lg font-bold text-slate-900 mb-2">
            Belum ada soal yang cocok dengan pilihan filter ini
          </p>
          <p className="text-sm text-slate-600 mb-4">
            Silakan pilih kombinasi bangun ruang atau tingkat kesulitan lainnya.
          </p>
          <button
            type="button"
            onClick={() => handleFilterChange('semua', 'semua')}
            className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold cursor-pointer"
          >
            Tampilkan Semua 22 Soal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="text-sky-700 font-bold tabular-nums">
                  Soal {safeIdx + 1} dari {filteredQuestions.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>{SHAPES_BY_ID[currentQ.shape].name}</span>
                <span aria-hidden="true">·</span>
                <span>{DIFFICULTY_LABELS[currentQ.difficulty]}</span>
                <span aria-hidden="true">·</span>
                <span>{INDICATOR_LABELS[currentQ.indicator]}</span>
              </div>

              <button
                type="button"
                onClick={() => onOpen3D(currentQ.shape)}
                className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
              >
                Lihat {SHAPES_BY_ID[currentQ.shape].name} di 3D →
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">
                {currentQ.contextLabel}
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Input Area */}
            {currentQ.type === 'multiple_choice' && currentQ.options ? (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const selected = currentDraft === opt;
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setDraftInputs((prev) => ({ ...prev, [currentQ.id]: opt }));
                        setFeedbackMap((prev) => ({
                          ...prev,
                          [currentQ.id]: {
                            checked: false,
                            isCorrect: false,
                            showSteps: prev[currentQ.id]?.showSteps ?? false,
                          },
                        }));
                      }}
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
                        {letter}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <label
                  htmlFor={`practice-input-${currentQ.id}`}
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Tuliskan Jawaban Berupa Angka
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id={`practice-input-${currentQ.id}`}
                    type="text"
                    inputMode="decimal"
                    value={currentDraft}
                    onChange={(e) => {
                      setDraftInputs((prev) => ({
                        ...prev,
                        [currentQ.id]: e.target.value,
                      }));
                      setFeedbackMap((prev) => ({
                        ...prev,
                        [currentQ.id]: {
                          checked: false,
                          isCorrect: false,
                          showSteps: prev[currentQ.id]?.showSteps ?? false,
                        },
                      }));
                    }}
                    placeholder="Contoh: 512"
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={!currentDraft.trim()}
                  className="px-6 py-3 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 disabled:opacity-40 transition-colors cursor-pointer min-h-[44px]"
                >
                  Periksa Jawaban
                </button>
                <button
                  type="button"
                  onClick={handleToggleSteps}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 text-slate-800 text-sm font-bold hover:bg-slate-200 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>
                    {currentFeedback?.showSteps
                      ? 'Sembunyikan Pembahasan'
                      : 'Lihat Pembahasan'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={safeIdx === 0}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx((i) => Math.min(filteredQuestions.length - 1, i + 1))
                  }
                  disabled={safeIdx >= filteredQuestions.length - 1}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Automated Feedback & Tailored Hint */}
            {currentFeedback?.checked && (
              <div
                className={`rounded-2xl p-5 border ${
                  currentFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {currentFeedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1.5">
                    <p className="font-bold text-base">
                      {currentFeedback.isCorrect
                        ? 'Hebat! Jawabanmu sudah tepat!'
                        : 'Belum tepat, ayo perbaiki bersama!'}
                    </p>
                    {!currentFeedback.isCorrect && (
                      <div className="flex items-start gap-2 text-sm bg-white/80 rounded-xl p-3 border border-amber-200">
                        <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>Petunjuk:</strong> {currentQ.hint}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step-by-Step 5 Literacy Explanation */}
            {currentFeedback?.showSteps && (
              <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Pembahasan Langkah demi Langkah
                  </h3>
                  <span className="text-sm font-mono font-bold text-sky-800">
                    Jawaban: {String(currentQ.correctAnswer)}{' '}
                    {currentQ.unit ? currentQ.unit : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-sm">
                  {(
                    [
                      ['1. Memahami Masalah', currentQ.steps.memahami],
                      ['2. Merumuskan Masalah', currentQ.steps.merumuskan],
                      ['3. Menggunakan Matematika', currentQ.steps.menggunakan],
                      ['4. Menafsirkan Hasil', currentQ.steps.menafsirkan],
                      ['5. Mengevaluasi Hasil', currentQ.steps.mengevaluasi],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="bg-white rounded-xl p-3 border border-sky-100">
                      <p className="text-xs font-bold text-sky-800 mb-0.5">{label}</p>
                      <p className="text-slate-700 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question Navigator Sidebar */}
          <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Daftar Nomor Soal Latihan
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
              {filteredQuestions.map((q, idx) => {
                const rec = practiceRecord.answeredIds[q.id];
                const isCurrent = idx === safeIdx;
                let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                if (rec?.isCorrect) {
                  btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                } else if (rec && !rec.isCorrect) {
                  btnStyle = 'bg-amber-100 text-amber-900 border-amber-300';
                }
                if (isCurrent) {
                  btnStyle = 'bg-sky-600 text-white border-sky-600';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-11 rounded-xl border text-sm font-bold tabular-nums cursor-pointer transition-colors ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p>Biru: Soal sedang dibuka</p>
              <p>Hijau: Sudah dijawab benar</p>
              <p>Kuning: Perlu dicoba lagi</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
