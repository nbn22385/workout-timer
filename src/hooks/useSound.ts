import { useCallback, useRef } from 'react';
import { playTripleBeep, playBoxingBell, playEndBell, ensureAudioContext } from '../utils/sound';

interface UseSoundOptions {
  countdownBeep: boolean;
  endBeep: boolean;
}

export function useSound(options: UseSoundOptions) {
  const lastBeepTime = useRef<number>(0);

  const playCountdown = useCallback(async (remainingTime: number) => {
    if (!options.countdownBeep) return;
    if (remainingTime > 3 || remainingTime < 1) return;
    if (remainingTime === lastBeepTime.current) return;
    
    lastBeepTime.current = remainingTime;
    await playTripleBeep();
  }, [options.countdownBeep]);

  const playStepEnd = useCallback(async () => {
    if (options.endBeep) {
      await playBoxingBell();
    }
  }, [options.endBeep]);

  const playWorkoutEnd = useCallback(async () => {
    if (options.endBeep) {
      await playEndBell();
    }
  }, [options.endBeep]);

  const initAudio = useCallback(async () => {
    await ensureAudioContext();
  }, []);

  return {
    playCountdown,
    playStepEnd,
    playWorkoutEnd,
    initAudio,
  };
}
