import { Part, PartComprehensiveExam } from '../types';
import { lightweightBookParts } from './lightweightBookOutline';

// Lightweight outline initially for zero-delay sidebar, navigation, and UI shell counters
export const bookParts: Part[] = lightweightBookParts;

// Memory cache for deferred part comprehensive exams
let cachedPartExamsData: Record<number, PartComprehensiveExam> | null = null;
let partExamsDeferredPromise: Promise<Record<number, PartComprehensiveExam>> | null = null;

/**
 * Deferred loader for non-critical large exam and summary datasets.
 * Prioritizes the initial UI shell rendering by loading exams in the background.
 */
export function loadPartExamsData(): Promise<Record<number, PartComprehensiveExam>> {
  if (cachedPartExamsData) {
    return Promise.resolve(cachedPartExamsData);
  }

  if (!partExamsDeferredPromise) {
    partExamsDeferredPromise = import('./partExamsData')
      .then((module) => {
        cachedPartExamsData = module.partExamsData;
        // Attach exams to static bookParts reference
        bookParts.forEach((part) => {
          if (cachedPartExamsData && cachedPartExamsData[part.id]) {
            part.summary = cachedPartExamsData[part.id];
            part.comprehensiveExam = cachedPartExamsData[part.id];
          }
        });
        return cachedPartExamsData;
      })
      .catch((err) => {
        console.error('Failed to load deferred part exams data:', err);
        return {} as Record<number, PartComprehensiveExam>;
      });
  }

  return partExamsDeferredPromise;
}

// Cache for dynamically loaded full parts
const loadedPartsCache = new Map<number, Part>();

/**
 * Dynamically load detailed lessons and chapters for a single part on demand.
 * This ensures the initial bundle stays minimal and only requested lessons are loaded.
 */
export async function loadPartDetails(partId: number): Promise<Part> {
  if (loadedPartsCache.has(partId)) {
    return loadedPartsCache.get(partId)!;
  }

  let fullPart: Part;
  switch (partId) {
    case 1: {
      const { part1 } = await import('./parts/part1');
      fullPart = part1;
      break;
    }
    case 2: {
      const { part2 } = await import('./parts/part2');
      fullPart = part2;
      break;
    }
    case 3: {
      const { part3 } = await import('./parts/part3');
      fullPart = part3;
      break;
    }
    case 4: {
      const { part4 } = await import('./parts/part4');
      fullPart = part4;
      break;
    }
    case 5: {
      const { part5 } = await import('./parts/part5');
      fullPart = part5;
      break;
    }
    case 6: {
      const { part6 } = await import('./parts/part6');
      fullPart = part6;
      break;
    }
    default:
      throw new Error(`Unknown part ID: ${partId}`);
  }

  if (cachedPartExamsData && cachedPartExamsData[fullPart.id]) {
    fullPart.summary = cachedPartExamsData[fullPart.id];
    fullPart.comprehensiveExam = cachedPartExamsData[fullPart.id];
  } else {
    // If exams are not yet loaded, asynchronously attach when deferred promise resolves
    loadPartExamsData().then((exams) => {
      if (exams[fullPart.id]) {
        fullPart.summary = exams[fullPart.id];
        fullPart.comprehensiveExam = exams[fullPart.id];
      }
    }).catch(() => {});
  }

  loadedPartsCache.set(partId, fullPart);
  return fullPart;
}

/**
 * Preload and return the full chapter and its parent part on demand
 */
export async function loadChapterWithPart(
  chapterId: number
): Promise<{ part: Part; chapter: Part['chapters'][0] }> {
  const lightPart =
    bookParts.find((p) => p.chapters.some((c) => c.id === chapterId)) || bookParts[0];
  const fullPart = await loadPartDetails(lightPart.id);
  const fullChapter =
    fullPart.chapters.find((c) => c.id === chapterId) || fullPart.chapters[0];
  return { part: fullPart, chapter: fullChapter };
}

/**
 * Automatically warm up and precache all course parts in the background
 * during idle periods for seamless offline review.
 */
export function preloadAllCourseParts(): void {
  const partIds = [1, 2, 3, 4, 5, 6];
  const schedulePreload = () => {
    let index = 0;
    const preloadNext = () => {
      if (index >= partIds.length) return;
      const id = partIds[index++];
      loadPartDetails(id).catch(() => {}).finally(() => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(preloadNext, { timeout: 4000 });
        } else {
          setTimeout(preloadNext, 1000);
        }
      });
    };
    preloadNext();
  };

  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(schedulePreload, { timeout: 3000 });
    } else {
      setTimeout(schedulePreload, 2000);
    }
  }
}

