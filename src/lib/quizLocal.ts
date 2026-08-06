/**
 * Lightweight local persistence for quiz attempts.
 *
 * The deployed backend can be slow to wake up, so a quiz result is written to
 * localStorage the moment the user finishes. The hub gate and dashboard read
 * these records as a fallback so a slow (or failed) server save never leaves
 * the user stuck in a redirect loop or on a stale scoreboard.
 */

export interface LocalQuizRecord {
  type: 'pre' | 'post';
  score: number;
  totalQuestions: number;
  completedAt: string;
  synced: boolean;
  answers: { questionId: number; selectedAnswer: number }[];
}

const keyFor = (type: 'pre' | 'post') => `cyberescape:quiz:${type}`;

export function saveLocalQuiz(
  type: 'pre' | 'post',
  data: Omit<LocalQuizRecord, 'type' | 'completedAt' | 'synced'>
): LocalQuizRecord {
  const record: LocalQuizRecord = {
    ...data,
    type,
    completedAt: new Date().toISOString(),
    synced: false,
  };
  try {
    localStorage.setItem(keyFor(type), JSON.stringify(record));
  } catch {
    // Storage unavailable (private mode / quota) — best-effort only.
  }
  return record;
}

export function markLocalQuizSynced(type: 'pre' | 'post') {
  const record = getLocalQuiz(type);
  if (!record) return;
  try {
    localStorage.setItem(keyFor(type), JSON.stringify({ ...record, synced: true }));
  } catch {
    // Best-effort only.
  }
}

export function getLocalQuiz(type: 'pre' | 'post'): LocalQuizRecord | null {
  try {
    const raw = localStorage.getItem(keyFor(type));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.type === type ? (parsed as LocalQuizRecord) : null;
  } catch {
    return null;
  }
}
