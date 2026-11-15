import { useState } from 'react';
import { ArrowRight, Box, Check, UserCheck } from 'lucide-react';
import { ALL_MENUS, renderMenuIcon } from '../components/Navbar';
import { LITERACY_STAGES } from '../data/literacyData';
import { MenuId, StudentIdentity } from '../types/learning';

interface HomePageProps {
  student: StudentIdentity;
  onUpdateStudent: (next: StudentIdentity) => void;
  onNavigate: (menu: MenuId) => void;
  practiceCount: number;
  latestScore: number | null;
}

export function HomePage({
  student,
  onUpdateStudent,
  onNavigate,
  practiceCount,
  latestScore,
}: HomePageProps) {
  const [nameInput, setNameInput] = useState(student.name);
  const [codeInput, setCodeInput] = useState(student.code);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      name: nameInput.trim() || 'Peserta Didik Kelas VI',
      code: codeInput.trim() || 'ARJ-06',
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-14 pb-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <p className="text-sm font-semibold text-sky-700 mb-3">
              Media Pembelajaran Matematika Kelas VI · SDN Arjasa 01
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 leading-tight mb-4">
              Media Literasi Matematis: Belajar Bangun Ruang 3D
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-7">
              Jelajahi bentuk bangun ruang secara nyata dalam tiga dimensi, buka jaring-jaringnya, pahami masalah cerita sehari-hari, dan latih kemampuan berpikir matematis secara bertahap.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('eksplorasi3d')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-sky-600 text-white text-base font-bold hover:bg-sky-700 transition-colors cursor-pointer min-h-[48px]"
              >
                <Box className="w-5 h-5" />
                <span>Mulai Eksplorasi 3D</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('materi')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-300 text-slate-900 text-base font-bold hover:bg-amber-400 transition-colors cursor-pointer min-h-[48px]"
              >
                <span>Pelajari Materi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] rounded-3xl overflow-hidden border border-slate-200 bg-sky-100 shadow-sm">
              <img
                src="/src/assets/images/hero_bangun_ruang_sd_1794744493974.jpg"
                alt="Ilustrasi bangun ruang tiga dimensi kubus, tabung, kerucut, balok, dan limas di meja belajar kelas VI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Student Identity & Quick Progress Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <form
              onSubmit={handleSaveIdentity}
              className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
            >
              <div className="sm:col-span-5">
                <label
                  htmlFor="home-student-name"
                  className="block text-xs font-semibold text-slate-600 mb-1"
                >
                  Nama Peserta Didik
                </label>
                <input
                  id="home-student-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white"
                />
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="home-student-code"
                  className="block text-xs font-semibold text-slate-600 mb-1"
                >
                  Kode / Nomor Absen
                </label>
                <input
                  id="home-student-code"
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Contoh: VI-01"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer min-h-[42px]"
                >
                  {savedNotice ? <Check className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  <span>{savedNotice ? 'Tersimpan' : 'Simpan Nama'}</span>
                </button>
              </div>
            </form>

            <div className="lg:col-span-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
              <div>
                <p className="text-xs font-semibold text-slate-500">Latihan Dikerjakan</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">
                  {practiceCount} <span className="text-sm font-medium text-slate-500">/ 22 soal</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Nilai Evaluasi Terakhir</p>
                <p className="text-xl font-bold text-sky-700 tabular-nums">
                  {latestScore !== null ? latestScore : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Main Menu Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Menu Pembelajaran Utama
          </h2>
          <p className="text-slate-600 mt-1">
            Pilih kartu menu di bawah ini untuk memulai kegiatan belajar bangun ruang dan literasi matematis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ALL_MENUS.map((menu, index) => {
            const colorCycle = [
              'bg-sky-50 text-sky-700 border-sky-200',
              'bg-amber-50 text-amber-800 border-amber-200',
              'bg-emerald-50 text-emerald-700 border-emerald-200',
            ][index % 3];

            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => onNavigate(menu.id)}
                className="group flex flex-col justify-between text-left bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${colorCycle}`}
                    >
                      {renderMenuIcon(menu.iconName, 'w-6 h-6')}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-1.5">
                    {menu.label}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {menu.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-sky-700">
                  <span>Buka Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Everyday Objects + 5 Mathematical Literacy Stages */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-[4/3] w-full bg-amber-50 overflow-hidden">
              <img
                src="/src/assets/images/benda_nyata_sd_1794744509760.jpg"
                alt="Siswa kelas VI mengamati benda sehari-hari berbentuk balok, kubus, prisma tenda, tabung, kerucut, dan bola"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Matematika Dekat dengan Kehidupan Kita
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dari kotak kado, kubus rubik, tenda pramuka, kaleng susu, topi ulang tahun, hingga bola sepak—semuanya adalah bangun ruang 3D yang bisa dihitung dan dipahami manfaatnya.
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => onNavigate('latihan')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <span>Coba Latihan Soal Cerita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              5 Langkah Literasi Matematis
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Website ini membimbingmu memecahkan masalah secara utuh—bukan sekadar menghafal rumus!
            </p>
            <div className="space-y-4">
              {LITERACY_STAGES.map((stage) => {
                const badgeStyle =
                  stage.accentColor === 'blue'
                    ? 'bg-sky-600 text-white'
                    : stage.accentColor === 'yellow'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-emerald-600 text-white';
                return (
                  <div
                    key={stage.id}
                    className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums ${badgeStyle}`}
                    >
                      {stage.order}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {stage.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                        {stage.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
