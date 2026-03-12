let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function ensureAudioContext(): Promise<AudioContext> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

export async function playCountdownBeep(frequency: number = 440, duration: number = 100): Promise<void> {
  const ctx = await ensureAudioContext();
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
  
  oscillator.start(now);
  oscillator.stop(now + duration / 1000);
}

export async function playTripleBeep(): Promise<void> {
  await playCountdownBeep(440, 100);
  await new Promise(resolve => setTimeout(resolve, 150));
  await playCountdownBeep(440, 100);
  await new Promise(resolve => setTimeout(resolve, 150));
  await playCountdownBeep(440, 100);
}

export async function playBoxingBell(): Promise<void> {
  const ctx = await ensureAudioContext();
  
  const frequencies = [730, 365, 183];
  const now = ctx.currentTime;
  
  frequencies.forEach((freq) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    oscillator.frequency.setValueAtTime(freq, now);
    oscillator.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.5);
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    oscillator.start(now);
    oscillator.stop(now + 0.6);
  });
}

export async function playEndBell(): Promise<void> {
  const ctx = await ensureAudioContext();
  
  const frequencies = [523, 659, 784, 1047];
  const now = ctx.currentTime;
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = now + i * 0.15;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.4);
  });
}
