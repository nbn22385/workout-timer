import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  TimerConfig,
  TimerState,
  TimerStatus,
  StepType,
} from '../types';

interface UseTimerProps {
  config: TimerConfig;
  onCountdown?: (remainingTime: number) => void;
  onStepEnd?: () => void;
  onComplete?: () => void;
}

export function useTimer({
  config,
  onCountdown,
  onStepEnd,
  onComplete,
}: UseTimerProps) {
  const [state, setState] = useState<TimerState>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalStepTime, setTotalStepTime] = useState(0);

  const configRef = useRef(config);
  const currentStepIndexRef = useRef(0);
  const currentStepDurationRef = useRef<number>(0);
  const currentRoundRef = useRef(1);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const lastSecondRef = useRef<number>(-1);
  const isTransitioningRef = useRef<boolean>(false);
  const stateRef = useRef(state);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const getTotalRounds = useCallback(() => {
    if (configRef.current.mode === 'simple') {
      return configRef.current.rounds;
    }
    const cfg = configRef.current;
    if (cfg.mode === 'custom') {
      return cfg.steps.filter(s => s.type === 'work').length;
    }
    return 1;
  }, []);

  const getCurrentStep = useCallback((): { name: string; type: StepType; duration: number } => {
    const cfg = configRef.current;
    const idx = currentStepIndexRef.current;
    
    if (cfg.mode === 'simple') {
      const isResting = idx % 2 === 1;
      return {
        name: isResting ? 'Rest' : cfg.intervalName || 'Work',
        type: isResting ? 'rest' : 'work',
        duration: isResting ? cfg.rest : cfg.interval,
      };
    } else {
      if (idx >= cfg.steps.length) {
        return { name: 'Done', type: 'other', duration: 0 };
      }
      const step = cfg.steps[idx];
      if (!step) {
        return { name: 'Step', type: 'other', duration: 0 };
      }
      return {
        name: step.name || 'Step',
        type: step.type || 'other',
        duration: step.duration || 0,
      };
    }
  }, []);

  const initializeTimer = useCallback(() => {
    const step = getCurrentStep();
    currentStepDurationRef.current = step.duration;
    setRemainingTime(step.duration);
    setTotalStepTime(step.duration);
    lastSecondRef.current = -1;
  }, [getCurrentStep]);

  const getTimerStatus = useCallback((): TimerStatus => {
    const step = getCurrentStep();
    return {
      state: stateRef.current,
      currentRound,
      totalRounds: getTotalRounds(),
      currentStepIndex,
      stepName: step.name,
      stepType: step.type,
      remainingTime,
      totalStepTime,
      isResting: step.type === 'rest',
    };
  }, [currentRound, getTotalRounds, currentStepIndex, getCurrentStep, remainingTime, totalStepTime]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimerInterval = useCallback((stepDuration: number) => {
    clearTimerInterval();
    startTimeRef.current = performance.now();
    lastSecondRef.current = -1;
    
    intervalRef.current = window.setInterval(() => {
      if (isTransitioningRef.current) return;
      if (stateRef.current !== 'running') return;
      if (stepDuration <= 0) return;
      
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const newRemaining = Math.max(0, stepDuration - elapsed);
      
      const currentSecond = Math.ceil(newRemaining);
      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        onCountdown?.(currentSecond);
      }

      setRemainingTime(newRemaining);

      if (newRemaining <= 0) {
        onStepEnd?.();
        advanceToNextStep();
      }
    }, 50);
  }, [clearTimerInterval, onCountdown, onStepEnd]);

  const advanceToNextStep = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    
    const cfg = configRef.current;
    const currentIdx = currentStepIndexRef.current;
    const wasRunning = stateRef.current === 'running';
    
    clearTimerInterval();
    
    let shouldComplete = false;
    let nextIndex = currentIdx + 1;
    let nextDuration = 0;
    
    if (cfg.mode === 'simple') {
      const totalSteps = cfg.rounds * 2;
      shouldComplete = nextIndex >= totalSteps;
      
      if (!shouldComplete) {
        const isResting = nextIndex % 2 === 1;
        nextDuration = isResting ? cfg.rest : cfg.interval;
      }
    } else {
      shouldComplete = nextIndex >= cfg.steps.length && !cfg.loop;
      
      if (!shouldComplete) {
        if (cfg.loop && nextIndex >= cfg.steps.length) {
          nextIndex = 0;
        }
        nextDuration = cfg.steps[nextIndex]?.duration || 0;
      }
    }
    
    if (shouldComplete) {
      setState('completed');
      isTransitioningRef.current = false;
      onComplete?.();
      return;
    }
    
    let nextRound = 1;
    if (cfg.mode === 'simple') {
      nextRound = Math.floor(nextIndex / 2) + 1;
    } else {
      const currentStep = cfg.steps[currentIdx];
      if (currentStep?.type === 'rest') {
        currentRoundRef.current += 1;
      }
      nextRound = currentRoundRef.current;
    }
    
    currentStepIndexRef.current = nextIndex;
    setCurrentStepIndex(nextIndex);
    setCurrentRound(nextRound);
    
    currentStepDurationRef.current = nextDuration;
    setRemainingTime(nextDuration);
    setTotalStepTime(nextDuration);
    lastSecondRef.current = -1;
    
    if (wasRunning) {
      startTimerInterval(nextDuration);
    }
    
    isTransitioningRef.current = false;
  }, [onComplete, clearTimerInterval, startTimerInterval]);

  const start = useCallback(() => {
    if (state === 'idle' || state === 'completed') {
      setCurrentRound(1);
      setCurrentStepIndex(0);
      currentStepIndexRef.current = 0;
      currentRoundRef.current = 1;
      initializeTimer();
    }
    
    setState('running');
    pausedTimeRef.current = 0;
    startTimerInterval(currentStepDurationRef.current);
  }, [state, initializeTimer, startTimerInterval]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    
    setState('paused');
    clearTimerInterval();
    pausedTimeRef.current = remainingTime;
  }, [state, remainingTime, clearTimerInterval]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    
    setState('running');
    const stepDuration = currentStepDurationRef.current;
    startTimeRef.current = performance.now() - ((stepDuration - pausedTimeRef.current) * 1000);
    lastSecondRef.current = -1;
    
    intervalRef.current = window.setInterval(() => {
      if (isTransitioningRef.current) return;
      if (stateRef.current !== 'running') return;
      if (stepDuration <= 0) return;
      
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const newRemaining = Math.max(0, stepDuration - elapsed);
      
      const currentSecond = Math.ceil(newRemaining);
      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        onCountdown?.(currentSecond);
      }

      setRemainingTime(newRemaining);

      if (newRemaining <= 0) {
        onStepEnd?.();
        advanceToNextStep();
      }
    }, 50);
  }, [state, onCountdown, onStepEnd]);

  const reset = useCallback(() => {
    clearTimerInterval();
    
    setState('idle');
    setCurrentRound(1);
    setCurrentStepIndex(0);
    currentStepIndexRef.current = 0;
    currentRoundRef.current = 1;
    initializeTimer();
    lastSecondRef.current = -1;
    isTransitioningRef.current = false;
  }, [clearTimerInterval, initializeTimer]);

  const skip = useCallback(() => {
    if (state === 'idle' || state === 'completed') return;
    
    if (state === 'running' || state === 'paused') {
      clearTimerInterval();
      onStepEnd?.();
      advanceToNextStep();
    }
  }, [state, onStepEnd, advanceToNextStep, clearTimerInterval]);

  useEffect(() => {
    if (state === 'idle') {
      initializeTimer();
    }
  }, [state, initializeTimer]);

  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  return {
    status: getTimerStatus(),
    start,
    pause,
    resume,
    reset,
    skip,
    isRunning: state === 'running',
    isPaused: state === 'paused',
    isCompleted: state === 'completed',
  };
}
