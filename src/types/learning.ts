export type MenuId =
  | 'beranda'
  | 'petunjuk'
  | 'tujuan'
  | 'materi'
  | 'eksplorasi3d'
  | 'latihan'
  | 'evaluasi'
  | 'hasil'
  | 'profil';

export type ShapeId =
  | 'kubus'
  | 'balok'
  | 'prisma'
  | 'limas'
  | 'tabung'
  | 'kerucut'
  | 'bola';

export type LiteracyIndicator =
  | 'memahami'
  | 'merumuskan'
  | 'menggunakan'
  | 'menafsirkan'
  | 'mengevaluasi';

export type DifficultyLevel = 'mudah' | 'sedang' | 'menantang';

export interface ShapePartInfo {
  id: string;
  label: string;
  description: string;
  roleInFormula: string;
}

export interface ShapeExampleProblem {
  title: string;
  story: string;
  steps: {
    memahami: string;
    merumuskan: string;
    menggunakan: string;
    menafsirkan: string;
    mengevaluasi: string;
  };
}

export interface ShapeMaterial {
  id: ShapeId;
  name: string;
  shortTag: string;
  definition: string;
  characteristics: string[];
  facesCount: string;
  edgesCount: string;
  verticesCount: string;
  surfaceAreaFormula: string;
  surfaceAreaExplanation: string;
  volumeFormula: string;
  volumeExplanation: string;
  everydayObjects: { name: string; detail: string }[];
  exampleProblem: ShapeExampleProblem;
  parts: Record<string, ShapePartInfo>;
  defaultDimensions: {
    p: number;
    l: number;
    t: number;
    r: number;
  };
}

export interface QuestionItem {
  id: string;
  shape: ShapeId;
  indicator: LiteracyIndicator;
  difficulty: DifficultyLevel;
  type: 'multiple_choice' | 'numeric';
  contextLabel: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  unit?: string;
  tolerance?: number;
  hint: string;
  steps: {
    memahami: string;
    merumuskan: string;
    menggunakan: string;
    menafsirkan: string;
    mengevaluasi: string;
  };
}

export interface StudentIdentity {
  name: string;
  code: string;
  schoolClass: string;
}

export interface PracticeRecord {
  answeredIds: Record<
    string,
    {
      userAnswer: string;
      isCorrect: boolean;
      attempts: number;
    }
  >;
}

export interface EvaluationAttempt {
  completedAt: string;
  answers: Record<string, string>;
  score: number;
  correctCount: number;
  totalQuestions: number;
  indicatorBreakdown: Record<
    LiteracyIndicator,
    { correct: number; total: number }
  >;
  missedShapes: ShapeId[];
}

export interface MediaProfileData {
  mediaName: string;
  targetUsers: string;
  schoolName: string;
  subject: string;
  topic: string;
  purpose: string;
  researcherName: string;
  researcherId: string;
  advisorName: string;
  institutionName: string;
}
