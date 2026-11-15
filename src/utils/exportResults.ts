import { jsPDF } from 'jspdf';
import { INDICATOR_LABELS } from '../data/literacyData';
import { SHAPES_BY_ID } from '../data/shapesData';
import {
  EvaluationAttempt,
  LiteracyIndicator,
  PracticeRecord,
  StudentIdentity,
} from '../types/learning';

export function exportResultsToCSV(
  student: StudentIdentity,
  latestEval: EvaluationAttempt | null,
  practice: PracticeRecord,
): void {
  const practiceEntries = Object.values(practice.answeredIds);
  const practiceCorrect = practiceEntries.filter((x) => x.isCorrect).length;

  const rows: string[][] = [
    ['LAPORAN HASIL BELAJAR - MEDIA LITERASI MATEMATIS: BELAJAR BANGUN RUANG 3D'],
    ['Sekolah', 'SDN Arjasa 01'],
    ['Nama Peserta Didik', student.name],
    ['Kode / NIS', student.code],
    ['Kelas', student.schoolClass],
    ['Tanggal Ekspor', new Date().toLocaleString('id-ID')],
    [],
    ['RINGKASAN LATIHAN MANDIRI'],
    ['Soal Latihan Dikerjakan', String(practiceEntries.length)],
    ['Jawaban Benar (Latihan)', String(practiceCorrect)],
    [
      'Jawaban Salah (Latihan)',
      String(practiceEntries.length - practiceCorrect),
    ],
    [],
  ];

  if (latestEval) {
    rows.push(['HASIL EVALUASI LITERASI MATEMATIS']);
    rows.push(['Waktu Selesai', new Date(latestEval.completedAt).toLocaleString('id-ID')]);
    rows.push(['Nilai Akhir', String(latestEval.score)]);
    rows.push(['Jumlah Soal', String(latestEval.totalQuestions)]);
    rows.push(['Jawaban Benar', String(latestEval.correctCount)]);
    rows.push([
      'Jawaban Salah',
      String(latestEval.totalQuestions - latestEval.correctCount),
    ]);
    rows.push([]);
    rows.push(['RINCIAN PER INDIKATOR LITERASI MATEMATIS', 'Benar', 'Total', 'Persentase']);
    (Object.keys(INDICATOR_LABELS) as LiteracyIndicator[]).forEach((ind) => {
      const stat = latestEval.indicatorBreakdown[ind] || { correct: 0, total: 0 };
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      rows.push([
        INDICATOR_LABELS[ind],
        String(stat.correct),
        String(stat.total),
        `${pct}%`,
      ]);
    });

    if (latestEval.missedShapes.length > 0) {
      rows.push([]);
      rows.push([
        'Materi Bangun Ruang yang Perlu Dipelajari Kembali',
        latestEval.missedShapes.map((s) => SHAPES_BY_ID[s].name).join('; '),
      ]);
    }
  } else {
    rows.push(['HASIL EVALUASI', 'Belum ada evaluasi yang diselesaikan']);
  }

  rows.push([]);
  rows.push([
    'Catatan',
    'Hasil ini menunjukkan capaian pada sesi evaluasi saat ini, bukan klaim peningkatan kemampuan sebelum tersedia data pengukuran sebelum dan sesudah penggunaan media.',
  ]);

  const csvContent =
    '\uFEFF' +
    rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (student.name || 'peserta_didik')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
  link.download = `hasil_belajar_${safeName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportResultsToPDF(
  student: StudentIdentity,
  latestEval: EvaluationAttempt | null,
  practice: PracticeRecord,
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const practiceEntries = Object.values(practice.answeredIds);
  const practiceCorrect = practiceEntries.filter((x) => x.isCorrect).length;

  let y = 18;
  doc.setFillColor(2, 132, 199);
  doc.rect(14, 12, 182, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('MEDIA LITERASI MATEMATIS: BELAJAR BANGUN RUANG 3D', 18, 21);
  doc.setFontSize(10);
  doc.text('Laporan Hasil Belajar Matematika Kelas VI - SDN Arjasa 01', 18, 28);

  y = 44;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(`Nama Peserta Didik : ${student.name}`, 16, y);
  y += 6;
  doc.text(`Kode / NIS          : ${student.code}`, 16, y);
  y += 6;
  doc.text(`Kelas / Sekolah     : ${student.schoolClass}`, 16, y);
  y += 6;
  doc.text(`Tanggal Laporan     : ${new Date().toLocaleString('id-ID')}`, 16, y);
  y += 10;

  doc.setDrawColor(203, 213, 225);
  doc.line(16, y, 194, y);
  y += 8;

  doc.setFontSize(12);
  doc.text('1. Ringkasan Latihan Soal Interaktif', 16, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(
    `Soal Dikerjakan: ${practiceEntries.length} | Benar: ${practiceCorrect} | Salah: ${practiceEntries.length - practiceCorrect}`,
    16,
    y,
  );
  y += 10;

  doc.setFontSize(12);
  doc.text('2. Hasil Evaluasi Literasi Matematis', 16, y);
  y += 7;
  doc.setFontSize(10);

  if (latestEval) {
    doc.text(
      `Nilai Akhir: ${latestEval.score} / 100   |   Benar: ${latestEval.correctCount} dari ${latestEval.totalQuestions} soal`,
      16,
      y,
    );
    y += 8;

    doc.setFontSize(11);
    doc.text('Capaian per Indikator Literasi Matematis:', 16, y);
    y += 6;
    doc.setFontSize(10);

    (Object.keys(INDICATOR_LABELS) as LiteracyIndicator[]).forEach((ind) => {
      const stat = latestEval.indicatorBreakdown[ind] || { correct: 0, total: 0 };
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      doc.text(
        `- ${INDICATOR_LABELS[ind]}: ${stat.correct}/${stat.total} (${pct}%)`,
        20,
        y,
      );
      y += 6;
    });

    y += 4;
    doc.setFontSize(11);
    doc.text('3. Rekomendasi Materi yang Perlu Dipelajari Kembali:', 16, y);
    y += 6;
    doc.setFontSize(10);
    if (latestEval.missedShapes.length > 0) {
      const names = latestEval.missedShapes
        .map((id) => SHAPES_BY_ID[id].name)
        .join(', ');
      const wrapped = doc.splitTextToSize(
        `Disarankan mempelajari kembali konsep dan eksplorasi 3D pada bangun: ${names}.`,
        176,
      );
      doc.text(wrapped, 16, y);
      y += wrapped.length * 5 + 4;
    } else {
      doc.text(
        'Seluruh bangun ruang pada evaluasi telah dikuasai dengan sangat baik.',
        16,
        y,
      );
      y += 8;
    }
  } else {
    doc.text('Peserta didik belum menyelesaikan sesi evaluasi.', 16, y);
    y += 10;
  }

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(16, y, 194, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const disclaimer = doc.splitTextToSize(
    'Catatan: Nilai di atas menggambarkan capaian peserta didik pada sesi evaluasi saat ini dan tidak dimaksudkan sebagai klaim peningkatan kemampuan sebelum tersedia data pengukuran sebelum dan sesudah penggunaan media.',
    176,
  );
  doc.text(disclaimer, 16, y);

  const safeName = (student.name || 'peserta_didik')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
  doc.save(`laporan_literasi_${safeName}.pdf`);
}
