import { useState, useCallback, useEffect } from 'react';
import { CircularRing } from './components/CircularRing';
import { Settings } from './components/Settings';
import { Icon } from './components/Icon';
import { useTimer } from './hooks/useTimer';
import { useSound } from './hooks/useSound';
import { useWakeLock } from './hooks/useWakeLock';
import type { TimerConfig, Settings as SettingsType, Preset } from './types';
import { DEFAULT_SIMPLE_CONFIG } from './types';
import { THEMES } from './themes';
import {
  loadPresets,
  savePresets,
  loadConfig,
  saveConfig,
  loadSettings,
  saveSettings,
  generateId,
} from './utils/storage';
import './App.css';

function App() {
  const [config, setConfig] = useState<TimerConfig>(() => loadConfig() || DEFAULT_SIMPLE_CONFIG);
  const [settings, setSettings] = useState<SettingsType>(() => loadSettings());
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets());
  const [showSettings, setShowSettings] = useState(false);

  const { countdownBeep, endBeep, wakeLock, theme } = settings;
  const { playCountdown, playStepEnd, playWorkoutEnd, initAudio } = useSound({
    countdownBeep,
    endBeep,
  });

  useWakeLock(wakeLock);

  const handleCountdown = useCallback(
    (remainingTime: number) => {
      if (remainingTime <= 3 && remainingTime >= 1) {
        playCountdown(remainingTime);
      }
    },
    [playCountdown]
  );

  const handleStepEnd = useCallback(() => {
    playStepEnd();
  }, [playStepEnd]);

  const handleComplete = useCallback(() => {
    playWorkoutEnd();
  }, [playWorkoutEnd]);

  const { status, start, pause, resume, reset, skip, isRunning, isPaused, isCompleted } =
    useTimer({
      config,
      onCountdown: handleCountdown,
      onStepEnd: handleStepEnd,
      onComplete: handleComplete,
    });

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  useEffect(() => {
    saveSettings(settings);
    
    // Inject theme colors as CSS variables
    const selectedTheme = THEMES.find((t) => t.id === theme);
    if (selectedTheme) {
      const root = document.documentElement;
      root.style.setProperty('--color-bg', selectedTheme.colors.bg);
      root.style.setProperty('--color-card', selectedTheme.colors.card);
      root.style.setProperty('--color-text', selectedTheme.colors.text);
      root.style.setProperty('--color-text-muted', selectedTheme.colors.textMuted);
      root.style.setProperty('--color-accent', selectedTheme.colors.accent);
      root.style.setProperty('--color-work', selectedTheme.colors.work);
      root.style.setProperty('--color-rest', selectedTheme.colors.rest);
      root.style.setProperty('--color-other', selectedTheme.colors.other);
      root.style.setProperty('--color-ring-track', selectedTheme.colors.ringTrack);
      root.style.setProperty('--color-border', selectedTheme.colors.border);
    }
  }, [settings, theme]);

  const handleConfigChange = (newConfig: TimerConfig) => {
    setConfig(newConfig);
    if (status.state !== 'running') {
      reset();
    }
  };

  const handleSettingsChange = (updates: Partial<SettingsType>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  

  const handleSavePreset = (name: string) => {
    const newPreset: Preset = {
      id: generateId(),
      name,
      config,
    };
    const newPresets = [...presets, newPreset];
    setPresets(newPresets);
    savePresets(newPresets);
  };

  const handleDeletePreset = (id: string) => {
    const newPresets = presets.filter((p) => p.id !== id);
    setPresets(newPresets);
    savePresets(newPresets);
  };

  const handlePlayPause = () => {
    if (isCompleted) {
      reset();
      start();
    } else if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      initAudio();
      start();
    }
  };

  return (
    <div className="app">
      <main className={`timer-display ${status.state === 'completed' ? 'completed' : ''}`}>
        <CircularRing
          remainingTime={status.remainingTime}
          totalTime={status.totalStepTime}
          stepType={status.stepType}
          stepName={status.stepName}
          showCompletion={isCompleted}
        />

        {config.mode === 'simple' && (
          <div className="round-info">
            {status.isResting ? 'Rest' : 'Round'} {status.currentRound} / {status.totalRounds}
          </div>
        )}

        {config.mode === 'custom' && (
          <div className="round-info">
            {status.stepType === 'rest' ? 'Rest' : 'Round'} {status.currentRound} 
            {status.totalRounds !== Infinity && ` / ${status.totalRounds}`}
          </div>
        )}
      </main>

      <div className="controls">
        <button className="control-btn reset" onClick={reset} disabled={status.state === 'idle'}>
          <Icon name="reset" size={24} />
        </button>
        <button className="control-btn play-pause" onClick={handlePlayPause}>
          {isRunning ? <Icon name="pause" size={28} /> : <Icon name="play" size={28} />}
        </button>
        <button className="control-btn skip" onClick={skip} disabled={status.state === 'idle' || isCompleted}>
          <Icon name="skip" size={24} />
        </button>
      </div>

      <div className="bottom-toggles">
        <button className="toggle-btn" onClick={() => setShowSettings(true)}>
          <Icon name="settings" size={20} />
        </button>
        <button
          className={`toggle-btn ${settings.countdownBeep ? 'active' : ''}`}
          onClick={() => handleSettingsChange({ countdownBeep: !settings.countdownBeep })}
        >
          <Icon name={settings.countdownBeep ? 'speaker' : 'speaker-off'} size={20} />
        </button>
        <button
          className={`toggle-btn ${wakeLock ? 'active' : ''}`}
          onClick={() => handleSettingsChange({ wakeLock: !settings.wakeLock })}
        >
          <Icon name={wakeLock ? 'lock' : 'unlock'} size={20} />
        </button>
      </div>

      {showSettings && (
        <Settings 
          config={config} 
          onConfigChange={handleConfigChange} 
          presets={presets}
          onSavePreset={handleSavePreset}
          onDeletePreset={handleDeletePreset}
          onClose={() => setShowSettings(false)} 
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </div>
  );
}

export default App;
