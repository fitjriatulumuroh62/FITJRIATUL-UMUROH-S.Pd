import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EvaluationPage } from './pages/EvaluationPage';
import { Explorer3DPage } from './pages/Explorer3DPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { MaterialsPage } from './pages/MaterialsPage';
import { ObjectivesPage } from './pages/ObjectivesPage';
import { PracticePage } from './pages/PracticePage';
import { ProfilePage } from './pages/ProfilePage';
import { ResultsPage } from './pages/ResultsPage';
import {
  EvaluationAttempt,
  MediaProfileData,
  MenuId,
  PracticeRecord,
  ShapeId,
  StudentIdentity,
} from './types/learning';
import {
  appendEvaluationAttempt,
  clearEvaluationDraft,
  EvaluationDraft,
  loadEvaluationDraft,
  loadEvaluationHistory,
  loadMediaProfile,
  loadPracticeRecord,
  loadStudentIdentity,
  resetPracticeRecord,
  saveEvaluationDraft,
  saveMediaProfile,
  savePracticeRecord,
  saveStudentIdentity,
} from './utils/storage';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<MenuId>('beranda');
  const [selectedShape, setSelectedShape] = useState<ShapeId>('kubus');

  const [student, setStudent] = useState<StudentIdentity>(() =>
    loadStudentIdentity(),
  );
  const [practiceRecord, setPracticeRecord] = useState<PracticeRecord>(() =>
    loadPracticeRecord(),
  );
  const [evalDraft, setEvalDraft] = useState<EvaluationDraft>(() =>
    loadEvaluationDraft(),
  );
  const [evalHistory, setEvalHistory] = useState<EvaluationAttempt[]>(() =>
    loadEvaluationHistory(),
  );
  const [mediaProfile, setMediaProfile] = useState<MediaProfileData>(() =>
    loadMediaProfile(),
  );

  const navigateTo = (menu: MenuId) => {
    setActiveMenu(menu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpen3D = (shape: ShapeId) => {
    setSelectedShape(shape);
    navigateTo('eksplorasi3d');
  };

  const handleOpenMaterial = (shape: ShapeId) => {
    setSelectedShape(shape);
    navigateTo('materi');
  };

  const handleUpdateStudent = (next: StudentIdentity) => {
    setStudent(next);
    saveStudentIdentity(next);
  };

  const handleSavePracticeAnswer = (
    questionId: string,
    userAnswer: string,
    isCorrect: boolean,
  ) => {
    setPracticeRecord((prev) => {
      const existing = prev.answeredIds[questionId];
      const next: PracticeRecord = {
        answeredIds: {
          ...prev.answeredIds,
          [questionId]: {
            userAnswer,
            isCorrect,
            attempts: (existing?.attempts ?? 0) + 1,
          },
        },
      };
      savePracticeRecord(next);
      return next;
    });
  };

  const handleResetPractice = () => {
    resetPracticeRecord();
    setPracticeRecord({ answeredIds: {} });
  };

  const handleUpdateEvalDraft = (next: EvaluationDraft) => {
    setEvalDraft(next);
    saveEvaluationDraft(next);
  };

  const handleCompleteEvaluation = (attempt: EvaluationAttempt) => {
    const nextHistory = appendEvaluationAttempt(attempt);
    setEvalHistory(nextHistory);
    clearEvaluationDraft();
    setEvalDraft({
      started: false,
      currentIndex: 0,
      answers: {},
      lastSavedAt: '',
    });
  };

  const handleSaveMediaProfile = (next: MediaProfileData) => {
    setMediaProfile(next);
    saveMediaProfile(next);
  };

  const practiceCount = Object.keys(practiceRecord.answeredIds).length;
  const latestScore = evalHistory[0]?.score ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar activeMenu={activeMenu} onNavigate={navigateTo} />

      <main className="flex-1">
        {activeMenu === 'beranda' && (
          <HomePage
            student={student}
            onUpdateStudent={handleUpdateStudent}
            onNavigate={navigateTo}
            practiceCount={practiceCount}
            latestScore={latestScore}
          />
        )}

        {activeMenu === 'petunjuk' && <GuidePage onNavigate={navigateTo} />}

        {activeMenu === 'tujuan' && <ObjectivesPage onNavigate={navigateTo} />}

        {activeMenu === 'materi' && (
          <MaterialsPage
            selectedShape={selectedShape}
            onSelectShape={setSelectedShape}
            onOpen3D={handleOpen3D}
            onNavigate={navigateTo}
          />
        )}

        {activeMenu === 'eksplorasi3d' && (
          <Explorer3DPage
            selectedShape={selectedShape}
            onSelectShape={setSelectedShape}
            onOpenMaterial={handleOpenMaterial}
          />
        )}

        {activeMenu === 'latihan' && (
          <PracticePage
            practiceRecord={practiceRecord}
            onSaveAnswer={handleSavePracticeAnswer}
            onResetPractice={handleResetPractice}
            onOpen3D={handleOpen3D}
          />
        )}

        {activeMenu === 'evaluasi' && (
          <EvaluationPage
            student={student}
            onUpdateStudent={handleUpdateStudent}
            draft={evalDraft}
            onUpdateDraft={handleUpdateEvalDraft}
            onCompleteEvaluation={handleCompleteEvaluation}
            latestAttempt={evalHistory[0] ?? null}
            onNavigate={navigateTo}
          />
        )}

        {activeMenu === 'hasil' && (
          <ResultsPage
            student={student}
            onUpdateStudent={handleUpdateStudent}
            practiceRecord={practiceRecord}
            evaluationHistory={evalHistory}
            onNavigate={navigateTo}
            onOpenMaterial={handleOpenMaterial}
            onOpen3D={handleOpen3D}
          />
        )}

        {activeMenu === 'profil' && (
          <ProfilePage
            profile={mediaProfile}
            onSaveProfile={handleSaveMediaProfile}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
          <p className="font-semibold text-slate-800 text-center sm:text-left">
            Media Literasi Matematis: Belajar Bangun Ruang 3D · Kelas VI SDN Arjasa 01
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('petunjuk')}
              className="hover:text-sky-700 font-medium cursor-pointer"
            >
              Petunjuk
            </button>
            <button
              type="button"
              onClick={() => navigateTo('tujuan')}
              className="hover:text-sky-700 font-medium cursor-pointer"
            >
              Tujuan
            </button>
            <button
              type="button"
              onClick={() => navigateTo('profil')}
              className="hover:text-sky-700 font-medium cursor-pointer"
            >
              Profil Media
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
