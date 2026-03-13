import { useState } from 'react';
import type { TimerConfig, SimpleConfig, CustomConfig, CustomStep, Preset, Settings as SettingsType } from '../types';
import { DEFAULT_SIMPLE_CONFIG, DEFAULT_CUSTOM_CONFIG } from '../types';
import { generateId } from '../utils/storage';
import { Icon } from './Icon';
import { THEMES, type ThemeId } from '../themes';

interface SettingsProps {
  config: TimerConfig;
  onConfigChange: (config: TimerConfig) => void;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
  onClose: () => void;
  settings: SettingsType;
  onSettingsChange: (updates: Partial<SettingsType>) => void;
}

export function Settings({ 
  config, 
  onConfigChange, 
  presets,
  onSavePreset,
  onDeletePreset,
  onClose,
  settings,
  onSettingsChange
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [touchDragOffset, setTouchDragOffset] = useState<number>(0);

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setCustomConfig((prev) => {
      const newSteps = [...prev.steps];
      const [removed] = newSteps.splice(draggedIndex, 1);
      newSteps.splice(dropIndex, 0, removed);
      return { ...prev, steps: newSteps };
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    // Only start drag if touching the drag handle area
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    if (!target.classList.contains('drag-handle')) {
      return;
    }
    
    setDraggedIndex(index);
    setTouchStartY(touch.clientY);
    setTouchDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setTouchDragOffset(touch.clientY - touchStartY);
    
    // Find which item we're hovering over
    const touchY = touch.clientY;
    const stepsList = document.querySelector('.steps-list');
    if (stepsList) {
      const items = stepsList.querySelectorAll('.step-item');
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (touchY >= rect.top && touchY <= rect.bottom) {
          setDragOverIndex(index);
        }
      });
    }
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      setCustomConfig((prev) => {
        const newSteps = [...prev.steps];
        const [removed] = newSteps.splice(draggedIndex, 1);
        newSteps.splice(dragOverIndex, 0, removed);
        return { ...prev, steps: newSteps };
      });
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTouchDragOffset(0);
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

        {/* Theme Selector */}
        <div className="settings-section">
          <div className="settings-form">
            <div className="form-group">
              <label>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => onSettingsChange({ theme: e.target.value as ThemeId })}
              >
                {THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
                      <span>{preset.name}</span>
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
                <div
                  key={step.id}
                  className={`step-item ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                >
                  <span
                    className="drag-handle"
                    title="Drag to reorder"
                    draggable
                    onDragStart={(e) => {
                      handleDragStart(index);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ transform: draggedIndex === index ? `translateY(${touchDragOffset}px)` : 'none' }}
                  >
                    ⋮⋮
                  </span>
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
                      onChange={(e) => {
                        // Only update if value is not empty (will validate on blur)
                        if (e.target.value !== '') {
                          const num = parseInt(e.target.value);
                          if (!isNaN(num)) {
                            updateStep(index, { duration: Math.max(1, Math.min(300, num)) });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        const num = parseInt(val);
                        if (isNaN(num) || num < 1) {
                          updateStep(index, { duration: 30 });
                        }
                      }}
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
