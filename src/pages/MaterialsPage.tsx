import { useState } from 'react';
import {
  Box,
  CheckCircle2,
  ChevronRight,
  Compass,
  Lightbulb,
  Package,
} from 'lucide-react';
import { ShapeIllustrationSVG } from '../components/ShapeIllustrationSVG';
import { LITERACY_STAGES } from '../data/literacyData';
import { SHAPES_BY_ID, SHAPES_LIST } from '../data/shapesData';
import { LiteracyIndicator, MenuId, ShapeId } from '../types/learning';

interface MaterialsPageProps {
  selectedShape: ShapeId;
  onSelectShape: (id: ShapeId) => void;
  onOpen3D: (id: ShapeId) => void;
  onNavigate: (menu: MenuId) => void;
}

const INTERACTIVE_CASE_STEPS: Record<
  LiteracyIndicator,
  {
    prompt: string;
    choices: { label: string; isBest: boolean; feedback: string }[];
  }
> = {
  memahami: {
    prompt:
      'Kasus Nyata: Kelas VI SDN Arjasa 01 akan mengecat bagian luar sebuah tempat sampah berbentuk tabung TANPA TUTUP (alas bawah ada, sisi atas terbuka) dengan jari-jari 14 cm dan tinggi 50 cm. Manakah informasi yang benar?',
    choices: [
      {
        label: 'Tabung memiliki r = 14 cm, t = 50 cm, dan permukaan yang dicat hanya 1 alas lingkaran + 1 selimut.',
        isBest: true,
        feedback:
          'Tepat! Karena tempat sampah terbuka di bagian atas, tutup lingkaran tidak ikut dicat.',
      },
      {
        label: 'Tabung memiliki diameter 14 cm, dan seluruh 2 lingkaran + selimut harus dicat.',
        isBest: false,
        feedback:
          'Periksa lagi! 14 cm di soal adalah jari-jari (r), bukan diameter, dan tempat sampah tidak memiliki tutup.',
      },
    ],
  },
  merumuskan: {
    prompt:
      'Rumus matematika manakah yang paling sesuai untuk menghitung luas bagian luar tempat sampah tanpa tutup tersebut?',
    choices: [
      {
        label: 'L = (π × r²) + (2 × π × r × t)',
        isBest: true,
        feedback:
          'Benar! Satu alas lingkaran (π × r²) ditambah selimut tabung (2 × π × r × t).',
      },
      {
        label: 'L = 2 × π × r × (r + t)',
        isBest: false,
        feedback:
          'Hati-hati! Rumus 2 × π × r × (r + t) menghitung 2 lingkaran (alas dan tutup). Tempat sampah kita tanpa tutup.',
      },
    ],
  },
  menggunakan: {
    prompt:
      'Mari hitung menggunakan r = 14 cm, t = 50 cm, dan π = 22/7. Berapakah hasil luas permukaan tempat sampah tanpa tutup?',
    choices: [
      {
        label: '616 + 4.400 = 5.016 cm²',
        isBest: true,
        feedback:
          'Mantap! Luas alas = 22/7 × 14 × 14 = 616 cm². Luas selimut = 2 × 22/7 × 14 × 50 = 4.400 cm². Total = 5.016 cm².',
      },
      {
        label: '616 + 2.200 = 2.816 cm²',
        isBest: false,
        feedback:
          'Cek kembali keliling alasnya! Luas selimut = 2 × π × r × t = 2 × 22/7 × 14 × 50 = 4.400 cm².',
      },
    ],
  },
  menafsirkan: {
    prompt:
      'Jika 1 kaleng kecil cat cukup untuk mengecat luas 2.500 cm², apa arti hasil 5.016 cm² bagi siswa kelas VI?',
    choices: [
      {
        label: 'Dibutuhkan minimal 3 kaleng kecil cat karena 2 kaleng hanya mencukupi 5.000 cm² (kurang 16 cm²).',
        isBest: true,
        feedback:
          'Penafsiran cerdas! Dalam kehidupan nyata, kekurangan 16 cm² berarti kita harus menyiapkan 3 kaleng atau mengoles lebih tipis.',
      },
      {
        label: 'Cukup 1 kaleng cat saja karena ukuran tempat sampahnya kecil.',
        isBest: false,
        feedback:
          '1 kaleng hanya cukup untuk 2.500 cm², sedangkan luas yang dicat mencapai 5.016 cm² (lebih dari dua kali lipatnya).',
      },
    ],
  },
  mengevaluasi: {
    prompt:
      'Bagaimana cara mengevaluasi bahwa perhitungan 5.016 cm² sudah benar dan wajar?',
    choices: [
      {
        label: 'Memastikan satuan sudah cm² (luas), tutup tidak ikut dihitung, dan ukuran sekitar 0,5 m² wajar untuk tempat sampah setinggi 50 cm.',
        isBest: true,
        feedback:
          'Sempurna! Evaluasi mencakup pengecekan rumus tanpa tutup, ketepatan satuan cm², dan kewajaran ukuran benda nyata.',
      },
      {
        label: 'Mengubah satuan cm² menjadi liter agar tampak lebih kecil.',
        isBest: false,
        feedback:
          'Liter adalah satuan volume (isi), bukan satuan luas permukaan yang dicat!',
      },
    ],
  },
};

export function MaterialsPage({
  selectedShape,
  onSelectShape,
  onOpen3D,
  onNavigate,
}: MaterialsPageProps) {
  const shape = SHAPES_BY_ID[selectedShape];
  const [activeStage, setActiveStage] = useState<LiteracyIndicator>('memahami');
  const [stageChoiceIdx, setStageChoiceIdx] = useState<Record<string, number>>({});

  const currentStageInfo = LITERACY_STAGES.find((s) => s.id === activeStage)!;
  const currentCase = INTERACTIVE_CASE_STEPS[activeStage];
  const chosenIdx = stageChoiceIdx[activeStage];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Header + Shape Selector */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <p className="text-sm font-semibold text-sky-700 mb-2">
          Materi Pembelajaran · 7 Bangun Ruang Kelas VI
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5">
          Materi Bangun Ruang
        </h1>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Pilih Bangun Ruang"
        >
          {SHAPES_LIST.map((item) => {
            const active = item.id === selectedShape;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectShape(item.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[44px] ${
                  active
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Shape Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Visual Diagram + Quick Properties */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Bangun Ruang</p>
                <h2 className="text-2xl font-extrabold text-slate-900">{shape.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => onOpen3D(shape.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors cursor-pointer shrink-0"
              >
                <Box className="w-4 h-4" />
                <span>Lihat di Lab 3D</span>
              </button>
            </div>

            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 mb-5 flex items-center justify-center">
              <ShapeIllustrationSVG shapeId={shape.id} className="w-full max-w-[260px] h-48" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Jumlah Sisi</p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">
                  {shape.facesCount}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Jumlah Rusuk</p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">
                  {shape.edgesCount}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Titik Sudut</p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">
                  {shape.verticesCount}
                </p>
              </div>
            </div>
          </div>

          {/* Everyday Objects */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Contoh Benda di Sekitar Kita
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shape.everydayObjects.map((obj) => (
                <div
                  key={obj.name}
                  className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5"
                >
                  <h4 className="text-sm font-bold text-slate-900">{obj.name}</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{obj.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Definition, Characteristics, Formulas, Worked Example */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Pengertian {shape.name}
              </h3>
              <p className="text-slate-700 text-base leading-relaxed">{shape.definition}</p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Karakteristik & Sifat-Sifat
              </h3>
              <ul className="space-y-2.5">
                {shape.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulas */}
            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4">
                <p className="text-xs font-bold text-sky-800 mb-1">Rumus Luas Permukaan</p>
                <p className="font-mono text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {shape.surfaceAreaFormula}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {shape.surfaceAreaExplanation}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-xs font-bold text-amber-900 mb-1">Rumus Volume (Isi)</p>
                <p className="font-mono text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {shape.volumeFormula}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {shape.volumeExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Worked Example with 5 Steps */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 text-sky-700 mb-2">
              <Lightbulb className="w-5 h-5" />
              <span className="text-sm font-bold">Contoh Soal & Pembahasan Literasi</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {shape.exampleProblem.title}
            </h3>
            <p className="text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm sm:text-base leading-relaxed mb-5">
              {shape.exampleProblem.story}
            </p>

            <div className="space-y-3">
              {(
                [
                  ['1. Memahami Masalah', shape.exampleProblem.steps.memahami],
                  ['2. Merumuskan Masalah', shape.exampleProblem.steps.merumuskan],
                  ['3. Menggunakan Matematika', shape.exampleProblem.steps.menggunakan],
                  ['4. Menafsirkan Hasil', shape.exampleProblem.steps.menafsirkan],
                  ['5. Mengevaluasi Hasil', shape.exampleProblem.steps.mengevaluasi],
                ] as const
              ).map(([title, content]) => (
                <div
                  key={title}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5"
                >
                  <p className="text-xs font-bold text-sky-800 mb-1">{title}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 5 Literacy Activities Practice Studio */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-emerald-700 mb-1">
              Aktivitas Interaktif Literasi Matematis
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Latih 5 Langkah Berpikir Matematis
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('latihan')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer self-start"
          >
            <span>Lanjut ke 22 Soal Latihan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {LITERACY_STAGES.map((stage) => {
            const active = stage.id === activeStage;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`px-3 py-3 rounded-xl text-left text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
                  active
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                }`}
              >
                <span className="block opacity-80 text-[11px]">Langkah {stage.order}</span>
                <span className="truncate block">{stage.shortTitle}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2 text-sky-700">
              <Compass className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900">{currentStageInfo.title}</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {currentStageInfo.summary}
            </p>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">
                Yang Dilatih pada Tahap Ini:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                {currentStageInfo.skills.map((sk, i) => (
                  <li key={i}>{sk}</li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-1.5">
                Pertanyaan Pemandu:
              </p>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentStageInfo.guidingQuestions.map((q, i) => (
                  <li key={i}>• {q}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-sky-50/70 border border-sky-200 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-sky-800 mb-2">
                Uji Pemahaman Langkah {currentStageInfo.order}
              </p>
              <p className="text-base font-semibold text-slate-900 mb-4 leading-relaxed">
                {currentCase.prompt}
              </p>

              <div className="space-y-3">
                {currentCase.choices.map((choice, idx) => {
                  const isSelected = chosenIdx === idx;
                  let style = 'bg-white border-slate-200 text-slate-800 hover:border-sky-400';
                  if (isSelected) {
                    style = choice.isBest
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : 'bg-amber-50 border-amber-500 text-amber-950';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setStageChoiceIdx((prev) => ({ ...prev, [activeStage]: idx }))
                      }
                      className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer ${style}`}
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {chosenIdx !== undefined && (
              <div
                className={`mt-4 rounded-xl p-4 border text-sm font-medium ${
                  currentCase.choices[chosenIdx].isBest
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                    : 'bg-amber-100 border-amber-300 text-amber-950'
                }`}
              >
                {currentCase.choices[chosenIdx].feedback}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
