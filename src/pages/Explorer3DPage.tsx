import { useState } from 'react';
import {
  BookOpen,
  Box,
  Eye,
  Hand,
  Info,
  Layers,
  RotateCcw,
  Ruler,
  Sliders,
} from 'lucide-react';
import {
  CameraPreset,
  Shape3DViewer,
  ShapeDimensions,
  ViewerToggles,
} from '../components/Shape3DViewer';
import { SHAPES_BY_ID, SHAPES_LIST } from '../data/shapesData';
import { ShapeId } from '../types/learning';

interface Explorer3DPageProps {
  selectedShape: ShapeId;
  onSelectShape: (id: ShapeId) => void;
  onOpenMaterial: (id: ShapeId) => void;
}

function formatNum(val: number): string {
  return Number.isInteger(val)
    ? val.toLocaleString('id-ID')
    : val.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

export function Explorer3DPage({
  selectedShape,
  onSelectShape,
  onOpenMaterial,
}: Explorer3DPageProps) {
  const shape = SHAPES_BY_ID[selectedShape];

  const [dimensions, setDimensions] = useState<ShapeDimensions>(
    shape.defaultDimensions,
  );
  const [toggles, setToggles] = useState<ViewerToggles>({
    showFaces: true,
    showEdges: true,
    showVertices: true,
    highlightBaseTop: false,
    showDimensions: true,
    netOpen: 0,
  });
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const [presetVersion, setPresetVersion] = useState(0);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  const handleChangeShape = (id: ShapeId) => {
    onSelectShape(id);
    setDimensions(SHAPES_BY_ID[id].defaultDimensions);
    setSelectedPart(null);
    setToggles((prev) => ({ ...prev, netOpen: 0 }));
    setCameraPreset('iso');
    setPresetVersion((v) => v + 1);
  };

  const handleResetView = () => {
    setCameraPreset('iso');
    setPresetVersion((v) => v + 1);
  };

  const handlePreset = (p: CameraPreset) => {
    setCameraPreset(p);
    setPresetVersion((v) => v + 1);
  };

  // Live geometric calculations in cm², cm³
  const computeMetrics = () => {
    const { p, l, t, r } = dimensions;
    const pi = 22 / 7;
    switch (selectedShape) {
      case 'kubus':
        return {
          volume: p * p * p,
          surfaceArea: 6 * p * p,
          extra: `Panjang seluruh 12 rusuk = ${formatNum(12 * p)} cm`,
        };
      case 'balok':
        return {
          volume: p * l * t,
          surfaceArea: 2 * (p * l + p * t + l * t),
          extra: `Luas alas = ${formatNum(p * l)} cm²`,
        };
      case 'prisma': {
        const baseArea = 0.5 * p * l;
        const slant = Math.hypot(p / 2, l);
        const perimeter = p + 2 * slant;
        return {
          volume: baseArea * t,
          surfaceArea: 2 * baseArea + perimeter * t,
          extra: `Luas alas Δ = ${formatNum(baseArea)} cm²`,
        };
      }
      case 'limas': {
        const baseArea = p * l;
        const slantFB = Math.hypot(l / 2, t);
        const slantLR = Math.hypot(p / 2, t);
        const sidesArea = p * slantFB + l * slantLR;
        return {
          volume: (1 / 3) * baseArea * t,
          surfaceArea: baseArea + sidesArea,
          extra: `Luas alas = ${formatNum(baseArea)} cm²`,
        };
      }
      case 'tabung':
        return {
          volume: pi * r * r * t,
          surfaceArea: 2 * pi * r * (r + t),
          extra: `π ≈ 22/7 · Luas selimut ≈ ${formatNum(2 * pi * r * t)} cm²`,
        };
      case 'kerucut': {
        const s = Math.hypot(r, t);
        return {
          volume: (1 / 3) * pi * r * r * t,
          surfaceArea: pi * r * (r + s),
          extra: `Garis pelukis s ≈ ${formatNum(s)} cm`,
        };
      }
      case 'bola':
        return {
          volume: (4 / 3) * pi * r * r * r,
          surfaceArea: 4 * pi * r * r,
          extra: `Diameter d = ${formatNum(2 * r)} cm`,
        };
    }
  };

  const metrics = computeMetrics();
  const activePartInfo =
    selectedPart && shape.parts[selectedPart]
      ? shape.parts[selectedPart]
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Bar: Shape Selector + Camera Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-sky-700">
              Laboratorium Visualisasi Tiga Dimensi Interaktif
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Eksplorasi Bangun Ruang 3D: {shape.name}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onOpenMaterial(selectedShape)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-300 text-slate-900 text-sm font-bold hover:bg-amber-400 transition-colors cursor-pointer self-start"
          >
            <BookOpen className="w-4 h-4" />
            <span>Baca Materi {shape.name}</span>
          </button>
        </div>

        {/* 7 Shape Buttons */}
        <div className="flex flex-wrap gap-2">
          {SHAPES_LIST.map((item) => {
            const active = item.id === selectedShape;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleChangeShape(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[40px] ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Zone Sandbox: Unobstructed 3D Viewport + Control & Concept Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Zone: 100% Unobstructed 3D Viewport */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px]">
            {webglError ? (
              <div className="w-full h-full rounded-2xl border border-amber-300 bg-amber-50 p-6 flex flex-col items-center justify-center text-center">
                <Box className="w-10 h-10 text-amber-700 mb-3" />
                <p className="font-bold text-slate-900 mb-1">Mode Pratinjau 3D Tidak Tersedia</p>
                <p className="text-sm text-slate-700 max-w-md">{webglError}</p>
              </div>
            ) : (
              <Shape3DViewer
                shapeId={selectedShape}
                dimensions={dimensions}
                toggles={toggles}
                cameraPreset={cameraPreset}
                presetVersion={presetVersion}
                selectedPart={selectedPart}
                onSelectPart={setSelectedPart}
                onWebGLError={setWebglError}
              />
            )}
          </div>

          {/* Camera Bar + Touch Instruction directly below canvas (never occludes model) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <Hand className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                Seret untuk memutar · Gulir/cubit untuk zoom · Klik sisi, rusuk, atau titik sudut untuk penjelasan
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ['iso', 'Isometrik'],
                  ['front', 'Depan'],
                  ['top', 'Atas'],
                  ['side', 'Samping'],
                ] as [CameraPreset, string][]
              ).map(([preset, lbl]) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lbl}
                </button>
              ))}
              <button
                type="button"
                onClick={handleResetView}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Clicked Part Explanation Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                {activePartInfo ? (
                  <>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="text-base font-bold text-slate-900">
                        Bagian Diklik: {activePartInfo.label}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setSelectedPart(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        Tutup sorotan
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      {activePartInfo.description}
                    </p>
                    <p className="text-xs font-semibold text-sky-800 bg-sky-50 rounded-lg px-3 py-2">
                      Peran dalam Rumus: {activePartInfo.roleInFormula}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-base font-bold text-slate-900 mb-1">
                      Klik Bagian Bangun Ruang 3D
                    </h2>
                    <p className="text-sm text-slate-600">
                      Ketuk atau klik langsung pada sisi alas, tutup, dinding sisi tegak, rusuk, titik sudut, atau garis tinggi di model 3D untuk membaca penjelasan dan perannya dalam rumus! Kamu juga bisa memilih bagian di daftar bawah ini:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {Object.values(shape.parts).map((part) => (
                        <button
                          key={part.id}
                          type="button"
                          onClick={() => setSelectedPart(part.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                        >
                          {part.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Inspection Toggles, Unfolding Net, Dimension Sliders & Live Math */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Interaction Toggles */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Eye className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold">Pilihan Tampilan Bagian</h2>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  ['showFaces', 'Tampilkan Sisi'],
                  ['showEdges', 'Tampilkan Rusuk'],
                  ['showVertices', 'Tampilkan Titik Sudut'],
                  ['highlightBaseTop', 'Sorot Alas & Tutup'],
                  ['showDimensions', 'Tampilkan Tinggi & Ukuran'],
                ] as [keyof Omit<ViewerToggles, 'netOpen'>, string][]
              ).map(([key, label]) => {
                const active = toggles[key];
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer min-h-[44px] ${
                      active
                        ? 'bg-sky-50 border-sky-300 text-sky-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        active
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {active ? 'Aktif' : 'Mati'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unfolding Net Control (Jaring-Jaring) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-900">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold">Jaring-Jaring Bangun</h2>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                {Math.round(toggles.netOpen * 100)}%
              </span>
            </div>

            {selectedShape === 'bola' ? (
              <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 border border-amber-200 rounded-xl p-3">
                Bola tidak memiliki jaring-jaring bidang datar yang utuh tanpa meregang atau memotong permukaannya menjadi irisan lengkung (seperti kulit jeruk).
              </p>
            ) : (
              <>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={toggles.netOpen}
                  aria-label="Buka Jaring-Jaring Bangun Ruang"
                  onChange={(e) =>
                    setToggles((prev) => ({
                      ...prev,
                      netOpen: parseFloat(e.target.value),
                      showFaces: true,
                    }))
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setToggles((prev) => ({ ...prev, netOpen: 0, showFaces: true }))
                    }
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer border ${
                      toggles.netOpen < 0.1
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tutup Rapat (3D)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setToggles((prev) => ({ ...prev, netOpen: 1, showFaces: true }))
                    }
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer border ${
                      toggles.netOpen > 0.9
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Buka Jaring-Jaring
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Interactive Dimension Sliders */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Sliders className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold">Ubah Ukuran Bangun</h2>
            </div>

            <div className="space-y-3">
              {selectedShape === 'kubus' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Panjang Rusuk (s)</span>
                    <span className="font-mono tabular-nums">{dimensions.p} cm</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={7}
                    step={0.5}
                    value={dimensions.p}
                    onChange={(e) =>
                      setDimensions((d) => ({ ...d, p: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              )}

              {(selectedShape === 'balok' ||
                selectedShape === 'prisma' ||
                selectedShape === 'limas') && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>
                        {selectedShape === 'prisma'
                          ? 'Alas Segitiga (a)'
                          : 'Panjang Alas (p)'}
                      </span>
                      <span className="font-mono tabular-nums">{dimensions.p} cm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={7}
                      step={0.5}
                      value={dimensions.p}
                      onChange={(e) =>
                        setDimensions((d) => ({ ...d, p: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>
                        {selectedShape === 'prisma'
                          ? 'Tinggi Segitiga (t Δ)'
                          : 'Lebar Alas (l)'}
                      </span>
                      <span className="font-mono tabular-nums">{dimensions.l} cm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={6}
                      step={0.5}
                      value={dimensions.l}
                      onChange={(e) =>
                        setDimensions((d) => ({ ...d, l: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {(selectedShape === 'tabung' ||
                selectedShape === 'kerucut' ||
                selectedShape === 'bola') && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Jari-jari (r)</span>
                    <span className="font-mono tabular-nums">{dimensions.r} cm</span>
                  </div>
                  <input
                    type="range"
                    min={1.4}
                    max={4.2}
                    step={0.2}
                    value={dimensions.r}
                    onChange={(e) =>
                      setDimensions((d) => ({ ...d, r: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              )}

              {selectedShape !== 'kubus' && selectedShape !== 'bola' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>
                      {selectedShape === 'prisma'
                        ? 'Tinggi Prisma (t)'
                        : 'Tinggi Bangun (t)'}
                    </span>
                    <span className="font-mono tabular-nums">{dimensions.t} cm</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={7}
                    step={0.5}
                    value={dimensions.t}
                    onChange={(e) =>
                      setDimensions((d) => ({ ...d, t: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Live Calculated Results */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Ruler className="w-3.5 h-3.5" />
                <span>Hasil Perhitungan Langsung</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-sky-50 border border-sky-200 p-3">
                  <p className="text-[11px] font-semibold text-sky-800">Luas Permukaan</p>
                  <p className="font-mono text-base font-bold text-slate-900 tabular-nums">
                    {formatNum(metrics.surfaceArea)} cm²
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-[11px] font-semibold text-amber-900">Volume</p>
                  <p className="font-mono text-base font-bold text-slate-900 tabular-nums">
                    {formatNum(metrics.volume)} cm³
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">{metrics.extra}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
