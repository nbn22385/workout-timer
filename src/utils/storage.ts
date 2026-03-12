import type { Preset, TimerConfig, Settings } from '../types';
import { DEFAULT_PRESETS, DEFAULT_SETTINGS } from '../types';

const PRESETS_KEY = 'interval-timer-presets';
const CONFIG_KEY = 'interval-timer-config';
const SETTINGS_KEY = 'interval-timer-settings';

export function loadPresets(): Preset[] {
  try {
    const stored = localStorage.getItem(PRESETS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load presets:', e);
  }
  return DEFAULT_PRESETS;
}

export function savePresets(presets: Preset[]): void {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error('Failed to save presets:', e);
  }
}

export function loadConfig(): TimerConfig | null {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load config:', e);
  }
  return null;
}

export function saveConfig(config: TimerConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
}

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
