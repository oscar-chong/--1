export type GameMode = 'quest' | 'blitz' | 'minigame' | 'codex';

export type StageId = 'stage-respiratory-digestive' | 'stage-growth-puberty' | 'stage-first-aid' | 'stage-crisis-safety';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'sequence' | 'scenario';

export interface Question {
  id: string;
  category: string;
  stageId: StageId;
  type: QuestionType;
  prompt: string;
  detail?: string;
  options: QuestionOption[];
  correctSequence?: string[]; // for sequence type questions
  explanation: string;
  bookReference: string; // e.g. "課本第5頁: 呼吸系統主要部分及運作"
  tag: '呼吸' | '消化' | '生殖發育' | '急救' | '危機安全';
}

export interface PlayerStats {
  score: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  totalAnswered: number;
  lives: number;
  maxLives: number;
  timeLeft: number;
  history: {
    questionId: string;
    isCorrect: boolean;
    selectedOption: string;
  }[];
}

export type RankGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface StageConfig {
  id: StageId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  targetScore: number;
  timeLimit: number; // in seconds
  description: string;
  tags: string[];
}
