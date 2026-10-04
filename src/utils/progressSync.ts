export interface ProgressEntry {
  value: boolean | string;
  updatedAt: number;
}

export type ProgressEntries = Record<string, ProgressEntry>;

const ENTRY_PREFIX = 'codemasr_sync_progress_';

function makeEntry(value: boolean | string, updatedAt = 0): ProgressEntry {
  return { value, updatedAt };
}

function parseObject(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function normalizeEntries(value: unknown): ProgressEntries {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const normalized: ProgressEntries = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!/^(completedChapter|completedQuiz|completedExam|completedChallenge|bookmarkedChapter|chapterNote|chapterChallengeCode|challengeSolution|bookChallengeSolution):[\w.-]{1,128}$/.test(key)) continue;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const entry = raw as Partial<ProgressEntry>;
    if ((typeof entry.value !== 'boolean' && typeof entry.value !== 'string') || typeof entry.updatedAt !== 'number' || !Number.isFinite(entry.updatedAt)) continue;
    normalized[key] = makeEntry(entry.value, Math.max(0, entry.updatedAt));
  }
  return normalized;
}

function addLegacyArray<T extends string | number>(
  entries: ProgressEntries,
  prefix: string,
  values: unknown,
): void {
  if (!Array.isArray(values)) return;
  for (const value of values) {
    if (typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value))) {
      entries[`${prefix}:${value}`] = makeEntry(true);
    }
  }
}

function addLegacyMap(
  entries: ProgressEntries,
  prefix: string,
  values: unknown,
  valueType: 'boolean' | 'string',
): void {
  if (!values || typeof values !== 'object' || Array.isArray(values)) return;
  for (const [key, value] of Object.entries(values)) {
    if (valueType === 'boolean' && typeof value === 'boolean') entries[`${prefix}:${key}`] = makeEntry(value);
    if (valueType === 'string' && typeof value === 'string') entries[`${prefix}:${key}`] = makeEntry(value);
  }
}

export function progressEntriesFromLegacy(progress: Record<string, unknown> | null | undefined): ProgressEntries {
  if (!progress) return {};
  const entries: ProgressEntries = {};
  addLegacyArray(entries, 'completedChapter', progress.completedChapters);
  addLegacyArray(entries, 'completedQuiz', progress.completedQuizzes);
  addLegacyArray(entries, 'completedExam', progress.completedExamParts);
  addLegacyArray(entries, 'completedChallenge', progress.completedChallenges);
  addLegacyArray(entries, 'bookmarkedChapter', progress.bookmarkedChapterIds);
  addLegacyMap(entries, 'chapterNote', progress.chapterNotes, 'string');
  addLegacyMap(entries, 'chapterChallengeCode', progress.challengeCodes, 'string');
  return entries;
}

export function readLocalProgressEntries(codeKey: string): ProgressEntries {
  let entries: ProgressEntries = {};
  try {
    entries = normalizeEntries(JSON.parse(localStorage.getItem(`${ENTRY_PREFIX}${codeKey}`) || '{}'));
  } catch {}

  const legacy = progressEntriesFromLegacy({
    completedChapters: parseArray(localStorage.getItem(`codemasr_progress_chapters_${codeKey}`)),
    completedQuizzes: parseArray(localStorage.getItem(`codemasr_progress_quizzes_${codeKey}`)),
    completedExamParts: parseArray(localStorage.getItem(`codemasr_progress_exams_${codeKey}`)),
    completedChallenges: parseArray(localStorage.getItem(`codemasr_completed_challenges_${codeKey}`)),
    bookmarkedChapterIds: parseArray(localStorage.getItem(`codemasr_bookmarks_${codeKey}`)),
    chapterNotes: parseObject(localStorage.getItem(`codemasr_notes_${codeKey}`)),
    challengeCodes: parseObject(localStorage.getItem(`codemasr_challenges_${codeKey}`)),
  });
  entries = { ...legacy, ...entries };

  const legacySolved = parseObject(localStorage.getItem(`codemasr_book_challenges_solved_${codeKey}`));
  for (const [id, solved] of Object.entries(legacySolved)) {
    if (typeof solved === 'boolean' && !entries[`completedChallenge:${id}`]) {
      entries[`completedChallenge:${id}`] = makeEntry(solved);
    }
  }

  const challengeCodePrefix = `codemasr_challenge_code_${codeKey}_`;
  const bookChallengeCodePrefix = `codemasr_book_chal_code_${codeKey}_`;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    if (key.startsWith(challengeCodePrefix)) {
      const entryKey = `challengeSolution:${key.slice(challengeCodePrefix.length)}`;
      if (!entries[entryKey]) entries[entryKey] = makeEntry(localStorage.getItem(key) || '');
    } else if (key.startsWith(bookChallengeCodePrefix)) {
      const entryKey = `bookChallengeSolution:${key.slice(bookChallengeCodePrefix.length)}`;
      if (!entries[entryKey]) entries[entryKey] = makeEntry(localStorage.getItem(key) || '');
    }
  }
  return normalizeEntries(entries);
}

function parseArray(value: string | null): unknown[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mergeProgressEntries(
  local: ProgressEntries,
  remote: ProgressEntries,
  preferRemoteOnTie: boolean,
): ProgressEntries {
  const merged = { ...local };
  for (const [key, incoming] of Object.entries(remote)) {
    const current = merged[key];
    if (!current || incoming.updatedAt > current.updatedAt || (preferRemoteOnTie && incoming.updatedAt === current.updatedAt)) {
      merged[key] = incoming;
    }
  }
  return merged;
}

export function updateProgressEntry(
  entries: ProgressEntries,
  key: string,
  value: boolean | string,
): ProgressEntries {
  const previousTime = entries[key]?.updatedAt || 0;
  return { ...entries, [key]: makeEntry(value, Math.max(Date.now(), previousTime + 1)) };
}

export function saveLocalProgressEntry(codeKey: string, key: string, value: boolean | string): ProgressEntry {
  let entries: ProgressEntries = {};
  try {
    entries = normalizeEntries(JSON.parse(localStorage.getItem(`${ENTRY_PREFIX}${codeKey}`) || '{}'));
  } catch {}
  const updated = updateProgressEntry(entries, key, value);
  saveLocalProgressEntries(codeKey, updated);
  return updated[key];
}

export function getTrueProgressIds(entries: ProgressEntries, prefix: string): Array<number | string> {
  const result: Array<number | string> = [];
  const keyPrefix = `${prefix}:`;
  for (const [key, entry] of Object.entries(entries)) {
    if (key.startsWith(keyPrefix) && entry.value === true) {
      const id = key.slice(keyPrefix.length);
      result.push(prefix === 'completedQuiz' || prefix === 'completedChallenge' ? id : Number(id));
    }
  }
  return result;
}

export function getStringProgressMap(entries: ProgressEntries, prefix: string): Record<string, string> {
  const result: Record<string, string> = {};
  const keyPrefix = `${prefix}:`;
  for (const [key, entry] of Object.entries(entries)) {
    if (key.startsWith(keyPrefix) && typeof entry.value === 'string' && entry.value !== '') {
      result[key.slice(keyPrefix.length)] = entry.value;
    }
  }
  return result;
}

export function saveLocalProgressEntries(codeKey: string, entries: ProgressEntries): void {
  try {
    localStorage.setItem(`${ENTRY_PREFIX}${codeKey}`, JSON.stringify(entries));
    localStorage.setItem('codemasr_progress_chapters_' + codeKey, JSON.stringify(getTrueProgressIds(entries, 'completedChapter')));
    localStorage.setItem('codemasr_progress_quizzes_' + codeKey, JSON.stringify(getTrueProgressIds(entries, 'completedQuiz')));
    localStorage.setItem('codemasr_progress_exams_' + codeKey, JSON.stringify(getTrueProgressIds(entries, 'completedExam')));
    localStorage.setItem('codemasr_completed_challenges_' + codeKey, JSON.stringify(getTrueProgressIds(entries, 'completedChallenge')));
    localStorage.setItem('codemasr_bookmarks_' + codeKey, JSON.stringify(getTrueProgressIds(entries, 'bookmarkedChapter')));
    localStorage.setItem('codemasr_notes_' + codeKey, JSON.stringify(getStringProgressMap(entries, 'chapterNote')));
    localStorage.setItem('codemasr_challenges_' + codeKey, JSON.stringify(getStringProgressMap(entries, 'chapterChallengeCode')));
    for (const [key, entry] of Object.entries(entries)) {
      if (typeof entry.value !== 'string') continue;
      if (key.startsWith('challengeSolution:')) {
        localStorage.setItem(`codemasr_challenge_code_${codeKey}_${key.slice('challengeSolution:'.length)}`, entry.value);
      } else if (key.startsWith('bookChallengeSolution:')) {
        localStorage.setItem(`codemasr_book_chal_code_${codeKey}_${key.slice('bookChallengeSolution:'.length)}`, entry.value);
      }
    }
  } catch (error) {
    console.error('Failed to cache learning progress locally:', error);
  }
}
