import {
  EvaluationAttempt,
  MediaProfileData,
  PracticeRecord,
  StudentIdentity,
} from '../types/learning';

const KEYS = {
  STUDENT: 'mlm_br3d_student_v1',
  PRACTICE: 'mlm_br3d_practice_v1',
  EVAL_DRAFT: 'mlm_br3d_eval_draft_v1',
  EVAL_HISTORY: 'mlm_br3d_eval_history_v1',
  PROFILE: 'mlm_br3d_media_profile_v1',
};

export const DEFAULT_STUDENT: StudentIdentity = {
  name: 'Peserta Didik Kelas VI',
  code: 'ARJ-06-01',
  schoolClass: 'Kelas VI — SDN Arjasa 01',
};

export const DEFAULT_MEDIA_PROFILE: MediaProfileData = {
  mediaName: 'Media Literasi Matematis: Belajar Bangun Ruang 3D',
  targetUsers: 'Peserta Didik Kelas VI Sekolah Dasar',
  schoolName: 'SDN Arjasa 01',
  subject: 'Matematika',
  topic: 'Bangun Ruang (Kubus, Balok, Prisma, Limas, Tabung, Kerucut, dan Bola)',
  purpose:
    'Mendukung peningkatan kemampuan literasi matematis peserta didik melalui eksplorasi objek 3D interaktif dan pemecahan masalah kontekstual.',
  researcherName: 'Pengembang Media Pembelajaran',
  researcherId: 'NIM / NIP dapat diisi di sini',
  advisorName: 'Guru / Pembimbing Kelas VI SDN Arjasa 01',
  institutionName: 'SDN Arjasa 01',
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadStudentIdentity(): StudentIdentity {
  return safeRead<StudentIdentity>(KEYS.STUDENT, DEFAULT_STUDENT);
}

export function saveStudentIdentity(data: StudentIdentity): void {
  safeWrite(KEYS.STUDENT, data);
}

export function loadPracticeRecord(): PracticeRecord {
  return safeRead<PracticeRecord>(KEYS.PRACTICE, { answeredIds: {} });
}

export function savePracticeRecord(record: PracticeRecord): void {
  safeWrite(KEYS.PRACTICE, record);
}

export function resetPracticeRecord(): void {
  safeWrite<PracticeRecord>(KEYS.PRACTICE, { answeredIds: {} });
}

export interface EvaluationDraft {
  started: boolean;
  currentIndex: number;
  answers: Record<string, string>;
  lastSavedAt: string;
}

export function loadEvaluationDraft(): EvaluationDraft {
  return safeRead<EvaluationDraft>(KEYS.EVAL_DRAFT, {
    started: false,
    currentIndex: 0,
    answers: {},
    lastSavedAt: '',
  });
}

export function saveEvaluationDraft(draft: EvaluationDraft): void {
  safeWrite(KEYS.EVAL_DRAFT, draft);
}

export function clearEvaluationDraft(): void {
  safeWrite<EvaluationDraft>(KEYS.EVAL_DRAFT, {
    started: false,
    currentIndex: 0,
    answers: {},
    lastSavedAt: '',
  });
}

export function loadEvaluationHistory(): EvaluationAttempt[] {
  return safeRead<EvaluationAttempt[]>(KEYS.EVAL_HISTORY, []);
}

export function appendEvaluationAttempt(attempt: EvaluationAttempt): EvaluationAttempt[] {
  const prev = loadEvaluationHistory();
  const next = [attempt, ...prev].slice(0, 20);
  safeWrite(KEYS.EVAL_HISTORY, next);
  return next;
}

export function loadMediaProfile(): MediaProfileData {
  return safeRead<MediaProfileData>(KEYS.PROFILE, DEFAULT_MEDIA_PROFILE);
}

export function saveMediaProfile(profile: MediaProfileData): void {
  safeWrite(KEYS.PROFILE, profile);
}
