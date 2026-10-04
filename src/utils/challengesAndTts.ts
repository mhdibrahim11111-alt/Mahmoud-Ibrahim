import { sessionHeaders } from './activation';

export async function markChallengeCompleted(challengeId: string): Promise<string[]> {
  try {
    const res = await fetch('/api/challenge/complete', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ challengeId }),
    });
    const data = await res.json();
    return data.completedChallenges || [];
  } catch (err) {
    console.error('Error recording completed challenge:', err);
    return [];
  }
}

export interface StudentActivityItem {
  id: string;
  code: string;
  studentName: string;
  status: 'active' | 'expired' | 'revoked';
  usedCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  feedback: string;
  draftCode: string;
  savedSnippets: Array<{
    id: string;
    title: string;
    code: string;
    language: string;
    updatedAt: string;
  }>;
  completedChallenges: string[];
  completedChapters: number[];
  completedQuizzes: string[];
  lastChapterId: number;
}

export async function fetchStudentActivity(): Promise<StudentActivityItem[]> {
  try {
    const res = await fetch('/api/admin/student-activity', {
      headers: sessionHeaders(),
    });
    const data = await res.json();
    return data.students || [];
  } catch (err) {
    console.error('Error fetching student activity:', err);
    return [];
  }
}

export async function sendStudentFeedback(code: string, feedback: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/student-feedback', {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({ code, feedback }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Error sending feedback:', err);
    return false;
  }
}
