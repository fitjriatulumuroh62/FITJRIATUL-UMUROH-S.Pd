import { LiteracyIndicator } from '../types/learning';

export interface LiteracyStageInfo {
  id: LiteracyIndicator;
  order: number;
  title: string;
  shortTitle: string;
  summary: string;
  skills: string[];
  guidingQuestions: string[];
  accentColor: 'blue' | 'yellow' | 'green';
}

export const LITERACY_STAGES: LiteracyStageInfo[] = [
  {
    id: 'memahami',
    order: 1,
    title: '1. Memahami Masalah',
    shortTitle: 'Memahami',
    summary:
      'Membaca soal cerita secara cermat untuk menangkap situasi nyata dan memilah informasi penting.',
    skills: [
      'Membaca soal cerita dengan teliti dari awal hingga akhir.',
      'Mengidentifikasi informasi yang diketahui beserta satuannya.',
      'Menentukan informasi yang ditanyakan dalam masalah.',
      'Memahami konteks permasalahan kehidupan sehari-hari.',
    ],
    guidingQuestions: [
      'Benda berbentuk apa yang diceritakan pada soal?',
      'Angka dan satuan apa saja yang sudah diketahui?',
      'Apa yang sebenarnya diminta untuk dicari?',
    ],
    accentColor: 'blue',
  },
  {
    id: 'merumuskan',
    order: 2,
    title: '2. Merumuskan Masalah',
    shortTitle: 'Merumuskan',
    summary:
      'Mengubah cerita kehidupan nyata menjadi model matematika yang tepat berupa bangun ruang dan rumusnya.',
    skills: [
      'Menentukan bangun ruang yang sesuai dengan benda pada soal.',
      'Menghubungkan informasi ukuran dengan unsur bangun (p, l, t, atau r).',
      'Menentukan rumus luas permukaan atau volume yang dibutuhkan.',
      'Menuliskan model matematika sebelum mulai berhitung.',
    ],
    guidingQuestions: [
      'Apakah masalah ini mencari isi (volume) atau pembungkus luar (luas permukaan)?',
      'Apakah semua sisi tertutup, atau tanpa tutup seperti akuarium?',
      'Bagaimana bentuk model matematikanya?',
    ],
    accentColor: 'yellow',
  },
  {
    id: 'menggunakan',
    order: 3,
    title: '3. Menggunakan Matematika',
    shortTitle: 'Menggunakan',
    summary:
      'Menjalankan perhitungan secara runtut, teliti, dan konsisten dalam satuan pengukuran.',
    skills: [
      'Memilih rumus yang tepat sesuai kondisi benda (utuh atau terbuka).',
      'Melakukan operasi hitung perkalian, pembagian, atau konversi satuan.',
      'Menyelesaikan permasalahan secara sistematis langkah demi langkah.',
      'Menuliskan satuan hasil perhitungan dengan benar (cm², cm³, atau liter).',
    ],
    guidingQuestions: [
      'Apakah semua satuan panjang sudah sama (misalnya sama-sama cm atau dm)?',
      'Apakah nilai π (22/7 atau 3,14) dipilih agar mudah dihitung?',
      'Sudah tepatkah satuan akhirnya (cm² untuk luas, cm³ atau liter untuk volume)?',
    ],
    accentColor: 'green',
  },
  {
    id: 'menafsirkan',
    order: 4,
    title: '4. Menafsirkan Hasil',
    shortTitle: 'Menafsirkan',
    summary:
      'Menerjemahkan angka hasil hitungan kembali ke dalam konteks masalah nyata yang ditanyakan.',
    skills: [
      'Menjelaskan arti angka hasil perhitungan dalam situasi nyata.',
      'Menghubungkan hasil matematika dengan kebutuhan benda atau kapasitas.',
      'Menuliskan kalimat kesimpulan yang jelas dan menjawab pertanyaan soal.',
    ],
    guidingQuestions: [
      'Apa makna angka tersebut bagi tokoh dalam cerita?',
      'Jika ditanya cukup atau tidak, bagaimana perbandingannya?',
      'Bagaimana kalimat kesimpulan yang lengkap?',
    ],
    accentColor: 'blue',
  },
  {
    id: 'mengevaluasi',
    order: 5,
    title: '5. Mengevaluasi Hasil',
    shortTitle: 'Mengevaluasi',
    summary:
      'Memeriksa ulang kebenaran langkah, rumus, satuan, serta kewajaran angka jawaban.',
    skills: [
      'Memeriksa kembali ketepatan perhitungan dari awal hingga akhir.',
      'Memeriksa kesesuaian rumus dengan bentuk benda (misal tanpa tutup).',
      'Memeriksa ketepatan satuan luas, volume, maupun kapasitas liter.',
      'Menilai apakah hasil masuk akal dan wajar untuk benda tersebut.',
    ],
    guidingQuestions: [
      'Mungkinkah volume kotak pensil sebesar volume kolam renang? Apakah angkanya masuk akal?',
      'Apakah tutup atau alas ikut dihitung atau seharusnya dikecualikan?',
      'Jika dihitung ulang dengan perkiraan kasar, apakah hasilnya mendekati?',
    ],
    accentColor: 'green',
  },
];

export const INDICATOR_LABELS: Record<LiteracyIndicator, string> = {
  memahami: 'Memahami Masalah',
  merumuskan: 'Merumuskan Masalah',
  menggunakan: 'Menggunakan Matematika',
  menafsirkan: 'Menafsirkan Hasil',
  mengevaluasi: 'Mengevaluasi Hasil',
};
