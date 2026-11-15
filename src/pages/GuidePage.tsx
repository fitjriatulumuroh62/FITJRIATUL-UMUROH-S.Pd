import {
  BookOpen,
  Box,
  ClipboardCheck,
  Compass,
  Award,
  PenTool,
  Wifi,
  ArrowRight,
} from 'lucide-react';
import { MenuId } from '../types/learning';

interface GuidePageProps {
  onNavigate: (menu: MenuId) => void;
}

export function GuidePage({ onNavigate }: GuidePageProps) {
  const steps: {
    title: string;
    detail: string[];
    actionLabel?: string;
    target?: MenuId;
    icon: React.ReactNode;
    accent: string;
  }[] = [
    {
      title: '1. Cara Membuka Website',
      detail: [
        'Buka alamat website pembelajaran melalui peramban (Chrome, Edge, atau Safari) di laptop, komputer, tablet, maupun smartphone.',
        'Pastikan layar berada pada kecerahan yang nyaman. Website otomatis menyesuaikan ukuran layar kecil maupun besar.',
      ],
      icon: <Compass className="w-6 h-6" />,
      accent: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: '2. Cara Memilih Menu',
      detail: [
        'Gunakan bilah menu di bagian atas layar untuk berpindah cepat antarhalaman.',
        'Di layar ponsel atau tablet kecil, tekan tombol ikon garis tiga di pojok kanan atas untuk melihat daftar semua 9 menu berukuran besar.',
        'Kamu juga bisa kembali ke Beranda kapan saja untuk memilih 9 kartu menu utama.',
      ],
      actionLabel: 'Kembali ke Beranda',
      target: 'beranda',
      icon: <Compass className="w-6 h-6" />,
      accent: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: '3. Cara Mempelajari Materi',
      detail: [
        'Buka menu Materi Bangun Ruang, lalu pilih salah satu dari 7 bangun ruang (Kubus, Balok, Prisma Segitiga, Limas Segiempat, Tabung, Kerucut, atau Bola).',
        'Baca pengertian, sifat-sifat, jumlah sisi/rusuk/titik sudut, rumus luas permukaan dan volume, contoh benda sehari-hari, serta contoh soal 5 langkah.',
        'Jangan lupa mencoba Lab 5 Langkah Literasi di bagian bawah halaman Materi agar terbiasa memahami soal cerita secara runtut.',
      ],
      actionLabel: 'Buka Materi Bangun Ruang',
      target: 'materi',
      icon: <BookOpen className="w-6 h-6" />,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: '4. Cara Menggunakan Objek 3D',
      detail: [
        'Geser (seret) dengan mouse atau sentuh layar untuk memutar bangun ruang 3D ke segala arah 360 derajat.',
        'Gunakan gulir mouse (scroll) atau cubit layar dengan dua jari (pinch) untuk memperbesar dan memperkecil model.',
        'Klik langsung bagian bangun (seperti alas, tutup, sisi tegak, rusuk, atau titik sudut) untuk membaca penjelasannya.',
        'Gunakan tombol Tampilkan Sisi, Rusuk, Titik Sudut, Sorot Alas & Tutup, Ukuran, penggeser Buka Jaring-Jaring, serta tombol Reset Sudut Pandang.',
      ],
      actionLabel: 'Coba Eksplorasi 3D',
      target: 'eksplorasi3d',
      icon: <Box className="w-6 h-6" />,
      accent: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: '5. Cara Mengerjakan Latihan',
      detail: [
        'Masuk ke menu Latihan Literasi Matematis dan pilih tingkat kesulitan (Mudah, Sedang, Menantang) atau jenis bangun ruang.',
        'Baca soal cerita dengan cermat, pilih jawaban atau ketik angka pada kolom isian, lalu tekan Periksa Jawaban.',
        'Jika jawaban masih kurang tepat, bacalah Petunjuk yang muncul untuk mencoba lagi, lalu pelajari Pembahasan 5 Langkah.',
      ],
      actionLabel: 'Buka Latihan Soal',
      target: 'latihan',
      icon: <PenTool className="w-6 h-6" />,
      accent: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: '6. Cara Mengikuti Evaluasi',
      detail: [
        'Pastikan nama dan kode peserta didik sudah terisi dengan benar, lalu klik Mulai Evaluasi.',
        'Gunakan tombol nomor soal untuk berpindah antarsoal. Setiap jawaban otomatis tersimpan sementara selama pengerjaan.',
        'Setelah semua soal dijawab, klik Selesaikan Evaluasi untuk melihat skor akhir, rincian per indikator, dan pembahasan setiap soal.',
      ],
      actionLabel: 'Buka Menu Evaluasi',
      target: 'evaluasi',
      icon: <ClipboardCheck className="w-6 h-6" />,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: '7. Cara Melihat Hasil Belajar',
      detail: [
        'Buka menu Hasil Belajar untuk melihat ringkasan nilai akhir, jumlah soal benar dan salah, serta kekuatan pada 5 indikator literasi matematis.',
        'Lihat bagian Rekomendasi Materi untuk mengetahui bangun ruang mana yang sebaiknya dipelajari ulang.',
        'Guru atau peserta didik dapat mengunduh rekap laporan dalam format PDF maupun CSV.',
      ],
      actionLabel: 'Lihat Hasil Belajar',
      target: 'hasil',
      icon: <Award className="w-6 h-6" />,
      accent: 'bg-sky-50 text-sky-700 border-sky-200',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <p className="text-sm font-semibold text-sky-700 mb-2">
          Panduan Peserta Didik & Guru · SDN Arjasa 01
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          Petunjuk Penggunaan Media
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Ikuti panduan ringkas berikut agar kamu dapat belajar bangun ruang 3D, berlatih soal cerita, dan mengerjakan evaluasi dengan lancar.
        </p>
      </div>

      <div className="space-y-5">
        {steps.map((step) => (
          <section
            key={step.title}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row gap-5 items-start"
          >
            <div
              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${step.accent}`}
            >
              {step.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h2>
              <ul className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed list-disc pl-5">
                {step.detail.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              {step.actionLabel && step.target && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => onNavigate(step.target!)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-800 text-sm font-bold hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Catatan Koneksi Internet */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-slate-900">
          <Wifi className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Catatan Kebutuhan Koneksi Internet
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Koneksi internet dibutuhkan saat pertama kali memuat halaman website, gambar ilustrasi, serta jenis huruf tampilan agar tampil rapi. Setelah halaman terbuka penuh, seluruh simulasi bangun ruang 3D, latihan soal, evaluasi, serta ekspor CSV/PDF berjalan langsung di peramban perangkat Anda dan jawaban tetap tersimpan di perangkat.
          </p>
        </div>
      </div>
    </div>
  );
}
