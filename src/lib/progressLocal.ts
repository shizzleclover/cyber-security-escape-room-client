/**
 * Lightweight local persistence for room scores and progress.
 * Provides a fallback when the backend API is unreachable in production.
 */

export interface LocalScore {
  roomId: string;
  score: number;
  maxScore: number;
  hintsUsed: number;
  timeSpent: number;
  completedAt: string;
}

export interface LocalProgress {
  roomId: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  currentStep: number;
}

const SCORES_KEY = 'cyberescape:scores';
const PROGRESS_KEY = 'cyberescape:progress';

export function saveLocalScore(scoreData: Omit<LocalScore, 'completedAt'>) {
  try {
    const existingStr = localStorage.getItem(SCORES_KEY);
    let scores: LocalScore[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Replace if exists, else add
    const index = scores.findIndex(s => s.roomId === scoreData.roomId);
    const newScore = { ...scoreData, completedAt: new Date().toISOString() };
    if (index >= 0) {
      scores[index] = newScore;
    } else {
      scores.push(newScore);
    }
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch {
    // Best-effort
  }
}

export function getLocalScores(): LocalScore[] {
  try {
    const existingStr = localStorage.getItem(SCORES_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}

export function saveLocalProgress(roomId: string, data: Omit<LocalProgress, 'roomId'>) {
  try {
    const existingStr = localStorage.getItem(PROGRESS_KEY);
    let progress: LocalProgress[] = existingStr ? JSON.parse(existingStr) : [];
    
    const index = progress.findIndex(p => p.roomId === roomId);
    const newProgress = { roomId, ...data };
    if (index >= 0) {
      progress[index] = newProgress;
    } else {
      progress.push(newProgress);
    }
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Best-effort
  }
}

export function getLocalProgress(): LocalProgress[] {
  try {
    const existingStr = localStorage.getItem(PROGRESS_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}
