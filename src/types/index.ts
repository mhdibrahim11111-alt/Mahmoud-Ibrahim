export type ViewMode = 'reader' | 'playground' | 'bughunter' | 'challenges';

export interface Exercise {
  id: string;
  title: string;
  code: string;
  expectedOutput: string;
  explanation?: string;
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
  challenge?: Challenge;
}

export interface Part {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  chapters: Chapter[];
  bugHunter: BugQuiz;
}

export interface BugQuiz {
  id: string;
  partId: number;
  title: string;
  context: string;
  problemCode: string;
  bugLineNumber: number;
  bugDescription: string;
  whyItHappens: string;
  fixedCode: string;
  expectedCorrectOutput: string;
  hints: string[];
}

export interface ExecutionResult {
  logs: string[];
  errors: string[];
  executionTimeMs: number;
  success: boolean;
}
