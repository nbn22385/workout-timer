import type { ThemeId } from '../themes';

export type StepType = 'work' | 'rest';

export interface SimpleConfig {
  mode: 'simple';
  intervalName: string;
  interval: number;
  rest: number;
  rounds: number;
}

export interface CustomStep {
  id: string;
  name: string;
  duration: number;
  type: StepType;
}

export interface CustomConfig {
  mode: 'custom';
  steps: CustomStep[];
  rounds: number;
}

export type TimerConfig = SimpleConfig | CustomConfig;

export interface Preset {
  id: string;
  name: string;
  config: TimerConfig;
}

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerStatus {
  state: TimerState;
  currentRound: number;
  totalRounds: number;
  currentStepIndex: number;
  stepName: string;
  stepType: StepType;
  remainingTime: number;
  totalStepTime: number;
  isResting: boolean;
}

export interface Settings {
  theme: ThemeId;
  countdownBeep: boolean;
  endBeep: boolean;
  wakeLock: boolean;
}

export const DEFAULT_SIMPLE_CONFIG: SimpleConfig = {
  mode: 'simple',
  intervalName: 'Work',
  interval: 30,
  rest: 10,
  rounds: 8,
};

export const DEFAULT_CUSTOM_CONFIG: CustomConfig = {
  mode: 'custom',
  steps: [
    { id: '1', name: 'Work', duration: 30, type: 'work' },
    { id: '2', name: 'Rest', duration: 10, type: 'rest' },
  ],
  rounds: 1,
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  countdownBeep: true,
  endBeep: true,
  wakeLock: true,
};

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'hiit',
    name: 'HIIT',
    config: {
      mode: 'simple',
      intervalName: 'High Intensity',
      interval: 40,
      rest: 20,
      rounds: 8,
    },
  },
  {
    id: 'tabata',
    name: 'Tabata',
    config: {
      mode: 'simple',
      intervalName: 'Tabata',
      interval: 20,
      rest: 10,
      rounds: 8,
    },
  },
  {
    id: 'simple',
    name: 'Simple',
    config: {
      mode: 'simple',
      intervalName: 'Work',
      interval: 60,
      rest: 30,
      rounds: 3,
    },
  },
];
