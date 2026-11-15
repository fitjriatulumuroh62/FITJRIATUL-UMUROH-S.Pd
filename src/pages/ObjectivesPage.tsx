import { ArrowRight, CheckCircle2, Target } from 'lucide-react';
import { LITERACY_STAGES } from '../data/literacyData';
import { MenuId } from '../types/learning';

interface ObjectivesPageProps {
  onNavigate: (menu: MenuId) => void;
}

const LEARNING_OBJECTIVES = [
  {
    num: 1,
    title: 'Memahami Konsep dan Karakteristik Bangun Ruang',
    desc: 'Mengenal pengertian, jumlah sisi, rusuk, titik sudut, serta ciri khusus dari kubus, balok, prisma, limas, tabung, kerucut, dan bola.',
  },
  {
    num: 2,
    title: 'Memvisualisasikan Bangun Ruang Melalui Objek 3D',
    desc: 'Mengamati langsung bentuk tiga dimensi dari berbagai sudut pandang, menyentuh bagian-bagiannya, dan membuka jaring-jaring bangun ruang.',
  },
  {
    num: 3,
    title: 'Menghubungkan Konsep dengan Kehidupan Sehari-hari',
    desc: 'Mengenali benda-benda di rumah dan sekolah seperti akuarium, tenda pramuka, kaleng susu, tumpeng, dan bola sebagai representasi bangun ruang.',
  },
  {
    num: 4,
    title: 'Memahami Informasi dalam Soal Cerita Matematika',
    desc: 'Menentukan fakta penting yang diketahui, satuan ukuran, kondisi benda (utuh atau tanpa tutup), dan hal yang ditanyakan dalam masalah.',
  },
  {
    num: 5,
    title: 'Merumuskan Permasalahan ke Model Matematika',
    desc: 'Memilih bangun ruang yang tepat dan menyusun rumus luas permukaan maupun volume sesuai bentuk nyata permasalahan.',
  },
  {
    num: 6,
    title: 'Menggunakan Konsep dan Prosedur Matematika',
    desc: 'Melakukan perhitungan secara sistematis, mengonversi satuan (seperti cm³ ke liter), dan menuliskan satuan akhir dengan tepat.',
  },
  {
    num: 7,
    title: 'Menafsirkan dan Mengevaluasi Hasil Penyelesaian',
    desc: 'Menjelaskan makna angka jawaban bagi situasi nyata serta memeriksa kembali ketepatan rumus, satuan, dan kewajaran hasil.',
  },
];

export function ObjectivesPage({ onNavigate }: ObjectivesPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-sm">
        <div className="flex items-center gap-3 text-sky-700 font-semibold text-sm mb-3">
          <Target className="w-5 h-5" />
          <span>Capaian Pembelajaran Matematika Kelas VI · SDN Arjasa 01</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          Tujuan Pembelajaran
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-3xl leading-relaxed">
          Media pembelajaran ini dirancang bukan hanya untuk menghafal rumus volume dan luas permukaan, melainkan untuk membangun kemampuan literasi matematis peserta didik kelas VI dalam menyelesaikan masalah nyata.
        </p>
      </div>

      {/* 7 Learning Objectives */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Tujuh Tujuan Utama Belajar Bangun Ruang 3D
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_OBJECTIVES.map((obj) => (
            <div
              key={obj.num}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex items-start gap-4"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white font-bold text-base tabular-nums">
                {obj.num}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                  {obj.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 Literacy Indicators Detail */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Indikator Kemampuan Literasi Matematis
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {LITERACY_STAGES.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
                <span className="text-xs font-semibold text-emerald-700">
                  Diukur pada Latihan & Evaluasi
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{stage.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stage.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-800 bg-slate-50 rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onNavigate('materi')}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors cursor-pointer"
        >
          <span>Mulai Belajar Materi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('eksplorasi3d')}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <span>Lihat Objek 3D</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
