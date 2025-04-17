export interface ArrayElement {
  value: number;
  index: number;
  isCurrent: boolean;
  isCandidateMatch: boolean;
}

export interface AnimationStep {
  elements: ArrayElement[];
  candidate: number | null;
  count: number;
  codeLine: number;
  description: string;
}

export interface AnimationState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  steps: AnimationStep[];
} 