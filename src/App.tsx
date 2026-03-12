import { useState, useCallback, useEffect } from 'react';
import { CircularRing } from './components/CircularRing';
import { Settings } from './components/Settings';
import { Presets } from './components/Presets';
import { Icon } from './components/Icon';
import { useTimer } from './hooks/useTimer';
import { useSound } from './hooks/useSound';
import { useWakeLock } from './hooks/useWakeLock';
import type { TimerConfig, Settings as SettingsType, Preset } from './types';
import { DEFAULT_SIMPLE_CONFIG } from './types';
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
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings, theme]);

  const handleConfigChange = (newConfig: TimerConfig) => {
    setConfig(newConfig);
    reset();
  };

  const handleSettingsChange = (updates: Partial<SettingsType>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleLoadPreset = (presetConfig: TimerConfig) => {
    setConfig(presetConfig);
    reset();
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
      <Presets
        presets={presets}
        activeConfig={config}
        onLoadPreset={handleLoadPreset}
        onSavePreset={handleSavePreset}
        onDeletePreset={handleDeletePreset}
      />

      <main className="timer-display">
        <CircularRing
          remainingTime={status.remainingTime}
          totalTime={status.totalStepTime}
          stepType={status.stepType}
          stepName={status.stepName}
        />

        {config.mode === 'simple' && (
          <div className="round-info">
            {status.isResting ? 'Rest' : 'Round'} {status.currentRound} / {status.totalRounds}
          </div>
        )}

        {config.mode === 'custom' && (
          <div className="round-info">
            {status.stepType === 'rest' ? 'Rest' : 'Round'} {status.currentRound} / {status.totalRounds}
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
          className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => handleSettingsChange({ theme: theme === 'dark' ? 'light' : 'dark' })}
        >
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={20} />
        </button>
        <button
          className={`toggle-btn ${wakeLock ? 'active' : ''}`}
          onClick={() => handleSettingsChange({ wakeLock: !settings.wakeLock })}
        >
          <Icon name={wakeLock ? 'lock' : 'unlock'} size={20} />
        </button>
      </div>

      {showSettings && (
        <Settings config={config} onConfigChange={handleConfigChange} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;
