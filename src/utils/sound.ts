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
  
  // Play a triumphant arpeggio (C-E-G-C)
  const notes = [
    { freq: 261.63, time: 0 },    // C4
    { freq: 329.63, time: 0.15 }, // E4
    { freq: 392.00, time: 0.3 },  // G4
    { freq: 523.25, time: 0.45 }, // C5
  ];
  const now = ctx.currentTime;
  
  notes.forEach(({ freq, time }) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'triangle';
    
    const startTime = now + time;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.5);
  });
}
