import { useState } from 'react';
import { Check, Info, RotateCcw, Save } from 'lucide-react';
import { MediaProfileData } from '../types/learning';
import { DEFAULT_MEDIA_PROFILE } from '../utils/storage';

interface ProfilePageProps {
  profile: MediaProfileData;
  onSaveProfile: (next: MediaProfileData) => void;
}

export function ProfilePage({ profile, onSaveProfile }: ProfilePageProps) {
  const [form, setForm] = useState<MediaProfileData>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    setForm(DEFAULT_MEDIA_PROFILE);
    onSaveProfile(DEFAULT_MEDIA_PROFILE);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-sm">
        <div className="flex items-center gap-2.5 text-sky-700 font-semibold text-sm mb-2">
          <Info className="w-5 h-5" />
          <span>Informasi & Identitas Pengembangan Media</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          Profil Media Pembelajaran
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Informasi resmi mengenai sasaran pengguna, kurikulum, serta identitas pengembang dan pembimbing yang dapat diperbarui sesuai kebutuhan sekolah atau penelitian.
        </p>
      </div>

      {/* Fixed Curriculum Metadata Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-5">
          Identitas Pokok Media
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Nama Media', form.mediaName],
            ['Sasaran Pengguna', form.targetUsers],
            ['Sekolah', form.schoolName],
            ['Mata Pelajaran', form.subject],
            ['Materi Pokok', form.topic],
            ['Tujuan Pengembangan', form.purpose],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
            >
              <p className="text-xs font-bold text-sky-800 mb-1">{label}</p>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Editable Researcher, Advisor & Institution Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Identitas Peneliti, Pembimbing & Institusi
            </h2>
            <p className="text-sm text-slate-600">
              Kolom di bawah ini dapat diedit dan disimpan langsung di perangkat Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan Awal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="prof-researcher"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Nama Peneliti / Pengembang Media
            </label>
            <input
              id="prof-researcher"
              type="text"
              value={form.researcherName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, researcherName: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="prof-researcher-id"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              NIM / NIP / Keterangan Peneliti
            </label>
            <input
              id="prof-researcher-id"
              type="text"
              value={form.researcherId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, researcherId: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="prof-advisor"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Nama Pembimbing / Guru Pendamping
            </label>
            <input
              id="prof-advisor"
              type="text"
              value={form.advisorName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, advisorName: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="prof-institution"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Institusi / Fakultas / Sekolah
            </label>
            <input
              id="prof-institution"
              type="text"
              value={form.institutionName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, institutionName: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors cursor-pointer"
          >
            {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedNotice ? 'Profil Tersimpan!' : 'Simpan Perubahan Profil'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
