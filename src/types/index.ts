export type ViewMode = 'reader' | 'playground' | 'bughunter' | 'challenges';

export interface Exercise {
  id: string;
  title: string;
  code: string;
  expectedOutput: string;
  explanation?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ChapterQuizItem {
  id: string;
  question: string;
  codeSnippet?: string;
  options: QuizOption[];
}

export interface Challenge {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  initialCode: string;
  solutionCode: string;
  expectedKeywords?: string[];
}

export interface Callout {
  type: 'tip' | 'warning' | 'celebration' | 'insight' | 'common_mistake';
  title: string;
  content: string;
}

export interface Chapter {
  id: number;
  partId: number;
  partTitle: string;
  title: string;
  subtitle: string;
  summaryPoints: string[];
  contentSections: {
    heading: string;
    text: string;
    codeSnippet?: string;
    callout?: Callout;
    type?: 'text' | 'html_preview';
    htmlCode?: string;
  }[];
  exercises: Exercise[];
  quiz?: ChapterQuizItem[];
  challenge?: Challenge;
}

export interface PartComprehensiveExam {
  id: string;
  partId: number;
  title: string;
  subtitle: string;
  description: string;
  keyPoints?: string[];
  quiz: ChapterQuizItem[];
  challenge: Challenge;
}

export type PartSummary = PartComprehensiveExam;

export interface Part {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  chapters: Chapter[];
  bugHunter: BugQuiz;
  summary?: PartComprehensiveExam;
  comprehensiveExam?: PartComprehensiveExam;
}

export interface BugQuiz {
  id: string;
  partId: number;
  title: string;
  context: string;
  problemCode: string;
  fixedCode: string;
  bugLineNumber?: number;
  expectedCorrectOutput?: string;
  hints: string[];
  bugDescription: string;
  whyItHappens: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ExecutionResult {
  success: boolean;
  logs: string[];
  errors: string[];
  executionTimeMs: number;
}
