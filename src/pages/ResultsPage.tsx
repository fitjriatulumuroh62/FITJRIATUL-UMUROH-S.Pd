import { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Box,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  UserCheck,
} from 'lucide-react';
import { INDICATOR_LABELS } from '../data/literacyData';
import { SHAPES_BY_ID } from '../data/shapesData';
import {
  EvaluationAttempt,
  LiteracyIndicator,
  MenuId,
  PracticeRecord,
  ShapeId,
  StudentIdentity,
} from '../types/learning';
import { exportResultsToCSV, exportResultsToPDF } from '../utils/exportResults';

interface ResultsPageProps {
  student: StudentIdentity;
  onUpdateStudent: (next: StudentIdentity) => void;
  practiceRecord: PracticeRecord;
  evaluationHistory: EvaluationAttempt[];
  onNavigate: (menu: MenuId) => void;
  onOpenMaterial: (shape: ShapeId) => void;
  onOpen3D: (shape: ShapeId) => void;
}

function getIndicatorLevel(pct: number): {
  label: string;
  style: string;
  barColor: string;
} {
  if (pct >= 80) {
    return {
      label: 'Sangat Baik',
      style: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-600',
    };
  }
  if (pct >= 60) {
    return {
      label: 'Cukup Baik',
      style: 'text-sky-800 bg-sky-50 border-sky-200',
      barColor: 'bg-sky-600',
    };
  }
  return {
    label: 'Perlu Penguatan',
    style: 'text-amber-900 bg-amber-50 border-amber-200',
    barColor: 'bg-amber-500',
  };
}

export function ResultsPage({
  student,
  onUpdateStudent,
  practiceRecord,
  evaluationHistory,
  onNavigate,
  onOpenMaterial,
  onOpen3D,
}: ResultsPageProps) {
  const [nameInput, setNameInput] = useState(student.name);
  const [codeInput, setCodeInput] = useState(student.code);
  const [savedFlag, setSavedFlag] = useState(false);

  const latestEval = evaluationHistory[0] ?? null;

  const practiceEntries = Object.values(practiceRecord.answeredIds);
  const practiceDone = practiceEntries.length;
  const practiceCorrect = practiceEntries.filter((x) => x.isCorrect).length;
  const practiceWrong = practiceDone - practiceCorrect;

  const totalAnsweredOverall =
    practiceDone + (latestEval ? latestEval.totalQuestions : 0);
  const totalCorrectOverall =
    practiceCorrect + (latestEval ? latestEval.correctCount : 0);
  const totalWrongOverall =
    practiceWrong +
    (latestEval ? latestEval.totalQuestions - latestEval.correctCount : 0);

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      name: nameInput.trim() || 'Peserta Didik Kelas VI',
      code: codeInput.trim() || 'ARJ-06',
    });
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header + Export Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-sky-700 mb-1">
              Rekap Capaian Peserta Didik · SDN Arjasa 01
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Hasil Belajar Literasi Matematis
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                exportResultsToPDF(student, latestEval, practiceRecord)
              }
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Unduh Laporan PDF</span>
            </button>
            <button
              type="button"
              onClick={() =>
                exportResultsToCSV(student, latestEval, practiceRecord)
              }
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh Data CSV</span>
            </button>
          </div>
        </div>

        {/* Editable Student Identity */}
        <form
          onSubmit={handleSaveStudent}
          className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
        >
          <div className="sm:col-span-5">
            <label
              htmlFor="res-student-name"
              className="block text-xs font-bold text-slate-600 mb-1"
            >
              Nama Peserta Didik
            </label>
            <input
              id="res-student-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white"
            />
          </div>
          <div className="sm:col-span-4">
            <label
              htmlFor="res-student-code"
              className="block text-xs font-bold text-slate-600 mb-1"
            >
              Kode / Nomor Absen
            </label>
            <input
              id="res-student-code"
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 cursor-pointer min-h-[42px]"
            >
              <UserCheck className="w-4 h-4" />
              <span>{savedFlag ? 'Diperbarui' : 'Perbarui Identitas'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4 Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Total Soal Dikerjakan
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalAnsweredOverall}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {practiceDone} latihan · {latestEval ? latestEval.totalQuestions : 0} evaluasi
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Jawaban Benar</p>
          <p className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {totalCorrectOverall}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Dari seluruh soal selesai
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Jawaban Salah</p>
          <p className="text-3xl font-extrabold text-amber-700 tabular-nums">
            {totalWrongOverall}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Kesempatan belajar ulang
          </p>
        </div>

        <div className="bg-sky-600 text-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-sky-100 mb-1">
            Nilai Akhir Evaluasi
          </p>
          <p className="text-3xl font-extrabold tabular-nums">
            {latestEval ? latestEval.score : '—'}
          </p>
          <p className="text-xs text-sky-100 mt-1">
            {latestEval ? 'Skala 0 – 100' : 'Belum mengikuti evaluasi'}
          </p>
        </div>
      </div>

      {/* Indicator Breakdown & Recommendations */}
      {!latestEval ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <Award className="w-10 h-10 text-sky-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">
            Belum Ada Data Evaluasi yang Diselesaikan
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Selesaikan 12 soal pada menu Evaluasi untuk melihat rincian kemampuan pada 5 indikator literasi matematis serta rekomendasi materi belajar khusus untukmu.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('evaluasi')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 cursor-pointer"
          >
            <span>Buka Menu Evaluasi</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 5 Literacy Indicator Summary */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-slate-900">
              Ringkasan Kemampuan per Indikator Literasi
            </h2>
            <div className="space-y-4">
              {(Object.keys(INDICATOR_LABELS) as LiteracyIndicator[]).map(
                (ind) => {
                  const stat = latestEval.indicatorBreakdown[ind] || {
                    correct: 0,
                    total: 0,
                  };
                  const pct =
                    stat.total > 0
                      ? Math.round((stat.correct / stat.total) * 100)
                      : 0;
                  const level = getIndicatorLevel(pct);
                  return (
                    <div key={ind} className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-bold text-slate-900">
                          {INDICATOR_LABELS[ind]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-600 tabular-nums">
                            {stat.correct}/{stat.total} ({pct}%)
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md border text-xs font-bold ${level.style}`}
                          >
                            {level.label}
                          </span>
                        </div>
                      </div>
                      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${level.barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Rekomendasi Materi Belajar
            </h2>
            {latestEval.missedShapes.length === 0 ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-950 leading-relaxed">
                  Luar biasa! Kamu menjawab benar seluruh soal evaluasi. Terus eksplorasi bangun ruang 3D dan soal menantang di menu Latihan untuk mengasah ketelitian.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Berdasarkan jawaban evaluasi terakhir, disarankan mempelajari kembali konsep dan jaring-jaring pada bangun ruang berikut:
                </p>
                <div className="space-y-3">
                  {latestEval.missedShapes.map((shapeId) => (
                    <div
                      key={shapeId}
                      className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 flex flex-col gap-2.5"
                    >
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {SHAPES_BY_ID[shapeId].name}
                        </h3>
                        <p className="text-xs text-slate-700">
                          {SHAPES_BY_ID[shapeId].shortTag}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenMaterial(shapeId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Pelajari Materi</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpen3D(shapeId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-xs font-bold text-white hover:bg-sky-700 cursor-pointer"
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>Lihat 3D</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Evaluation History Table (if > 0) */}
      {evaluationHistory.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Riwayat Evaluasi Tersimpan
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
              <Download className="w-3.5 h-3.5" />
              <span>Siap diekspor guru</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-4 font-bold">Waktu Selesai</th>
                  <th className="py-2.5 pr-4 font-bold">Benar / Total</th>
                  <th className="py-2.5 pr-4 font-bold">Nilai Akhir</th>
                </tr>
              </thead>
              <tbody>
                {evaluationHistory.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 text-slate-700 tabular-nums">
                      {new Date(item.completedAt).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-slate-900 tabular-nums">
                      {item.correctCount} / {item.totalQuestions}
                    </td>
                    <td className="py-3 pr-4 font-bold text-sky-700 tabular-nums">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scientific Honesty Note (Required by Section J) */}
      <div className="rounded-2xl bg-slate-100 border border-slate-200 p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong>Catatan Pengukuran Belajar:</strong> Skor dan ringkasan di halaman ini menggambarkan capaian peserta didik pada sesi latihan dan evaluasi saat ini. Hasil ini tidak diklaim sebagai peningkatan kemampuan sebelum tersedia data pengukuran sebelum (<em>pre-test</em>) dan sesudah (<em>post-test</em>) penggunaan media pembelajaran.
        </p>
      </div>
    </div>
  );
}
