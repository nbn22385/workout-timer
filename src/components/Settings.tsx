import { useState } from 'react';
import type { TimerConfig, SimpleConfig, CustomConfig, CustomStep, Preset } from '../types';
import { DEFAULT_SIMPLE_CONFIG, DEFAULT_CUSTOM_CONFIG } from '../types';
import { generateId } from '../utils/storage';
import { Icon } from './Icon';

interface SettingsProps {
  config: TimerConfig;
  onConfigChange: (config: TimerConfig) => void;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
  onClose: () => void;
}

export function Settings({ 
  config, 
  onConfigChange, 
  presets,
  onSavePreset,
  onDeletePreset,
  onClose 
}: SettingsProps) {
  const [mode, setMode] = useState<'simple' | 'custom'>(config.mode);
  const [simpleConfig, setSimpleConfig] = useState<SimpleConfig>(
    config.mode === 'simple' ? { ...config } : { ...DEFAULT_SIMPLE_CONFIG }
  );
  const [customConfig, setCustomConfig] = useState<CustomConfig>(
    config.mode === 'custom' ? { ...config } : { ...DEFAULT_CUSTOM_CONFIG }
  );
  const [showPresets, setShowPresets] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const handleClose = () => {
    if (mode === 'simple') {
      onConfigChange(simpleConfig);
    } else {
      onConfigChange(customConfig);
    }
    onClose();
  };

  const handleModeChange = (newMode: 'simple' | 'custom') => {
    setMode(newMode);
  };

  const handleSimpleChange = (updates: Partial<SimpleConfig>) => {
    setSimpleConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCustomChange = (updates: Partial<CustomConfig>) => {
    setCustomConfig((prev) => ({ ...prev, ...updates }));
  };

  const addStep = () => {
    const newStep: CustomStep = {
      id: generateId(),
      name: 'New Step',
      duration: 30,
      type: 'work',
    };
    setCustomConfig((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const updateStep = (index: number, updates: Partial<CustomStep>) => {
    setCustomConfig((prev) => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], ...updates };
      return { ...prev, steps: newSteps };
    });
  };

  const removeStep = (index: number) => {
    setCustomConfig((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= customConfig.steps.length) return;
    setCustomConfig((prev) => {
      const newSteps = [...prev.steps];
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
      return { ...prev, steps: newSteps };
    });
  };

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      onSavePreset(newPresetName.trim());
      setNewPresetName('');
    }
  };

  const handleLoadPreset = (preset: Preset) => {
    const presetConfig = preset.config;
    if (presetConfig.mode === 'simple') {
      setSimpleConfig(presetConfig);
      setMode('simple');
    } else {
      setCustomConfig(presetConfig);
      setMode('custom');
    }
    // Close settings panel and apply the preset
    if (presetConfig.mode === 'simple') {
      onConfigChange(presetConfig);
    } else {
      onConfigChange(presetConfig);
    }
    onClose();
  };

  const handleDeletePreset = (id: string) => {
    onDeletePreset(id);
  };

  return (
    <div className="settings-overlay" onClick={handleClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        {/* Presets Section */}
        <div className="settings-section">
          <div className="section-header" onClick={() => setShowPresets(!showPresets)}>
            <span>Presets</span>
            <Icon name={showPresets ? 'chevron-up' : 'chevron-down'} size={16} />
          </div>
          {showPresets && (
            <div className="presets-section">
              <div className="presets-list">
                {presets.map((preset) => (
                  <div key={preset.id} className="preset-item">
                    <button
                      className="preset-load-btn"
                      onClick={() => handleLoadPreset(preset)}
                    >
                      {preset.name}
                      <Icon name="check" size={14} className="check-icon" />
                    </button>
                    <button
                      className="preset-delete-btn"
                      onClick={() => handleDeletePreset(preset.id)}
                      disabled={['hiit', 'tabata', 'simple'].includes(preset.id)}
                    >
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="save-preset-row">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="New preset name"
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                />
                <button onClick={handleSavePreset}>
                  <Icon name="check" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mode-toggle">
          <button
            className={mode === 'simple' ? 'active' : ''}
            onClick={() => handleModeChange('simple')}
          >
            Simple
          </button>
          <button
            className={mode === 'custom' ? 'active' : ''}
            onClick={() => handleModeChange('custom')}
          >
            Custom
          </button>
        </div>

        {mode === 'simple' ? (
          <div className="settings-form">
            <div className="form-group">
              <label>Workout Name</label>
              <input
                type="text"
                value={simpleConfig.intervalName}
                onChange={(e) => handleSimpleChange({ intervalName: e.target.value })}
                placeholder="e.g., Pushups"
              />
            </div>
            <div className="form-group">
              <label>Work Interval (seconds)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={simpleConfig.interval}
                onChange={(e) => handleSimpleChange({ interval: parseInt(e.target.value) || 30 })}
              />
            </div>
            <div className="form-group">
              <label>Rest Interval (seconds)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={simpleConfig.rest}
                onChange={(e) => handleSimpleChange({ rest: parseInt(e.target.value) || 10 })}
              />
            </div>
            <div className="form-group">
              <label>Number of Rounds</label>
              <input
                type="number"
                min="1"
                max="99"
                value={simpleConfig.rounds}
                onChange={(e) => handleSimpleChange({ rounds: parseInt(e.target.value) || 8 })}
              />
            </div>
          </div>
        ) : (
          <div className="settings-form custom-mode">
            <div className="loop-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={customConfig.loop}
                  onChange={(e) => handleCustomChange({ loop: e.target.checked })}
                />
                Loop sequence
              </label>
            </div>
            <div className="steps-list">
              {customConfig.steps.map((step, index) => (
                <div key={step.id} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <div className="step-fields">
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(index, { name: e.target.value })}
                      placeholder="Step name"
                    />
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={step.duration}
                      onChange={(e) => updateStep(index, { duration: parseInt(e.target.value) || 30 })}
                    />
                    <select
                      value={step.type}
                      onChange={(e) => updateStep(index, { type: e.target.value as CustomStep['type'] })}
                    >
                      <option value="work">Work</option>
                      <option value="rest">Rest</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="step-actions">
                    <button onClick={() => moveStep(index, 'up')} disabled={index === 0}>↑</button>
                    <button onClick={() => moveStep(index, 'down')} disabled={index === customConfig.steps.length - 1}>↓</button>
                    <button onClick={() => removeStep(index)} className="delete">×</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="add-step-btn" onClick={addStep}>+ Add Step</button>
          </div>
        )}
      </div>
    </div>
  );
}
