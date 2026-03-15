import { useState } from 'react';
import type { TimerConfig, SimpleConfig, CustomConfig, CustomStep, StepType, Preset, Settings as SettingsType } from '../types';
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
  
  // Swipe to delete state
  const [swipeStates, setSwipeStates] = useState<Record<string, number>>({});
  const [activeSwipeIndex, setActiveSwipeIndex] = useState<number | null>(null);
  const [swipeStartX, setSwipeStartX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

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
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    
    // If touching drag handle, use drag mode
    if (target.classList.contains('drag-handle')) {
      e.stopPropagation();
      setDraggedIndex(index);
      setTouchStartY(touch.clientY);
      setTouchDragOffset(0);
      return;
    }
    
    // Don't start swipe if touching input fields, buttons, or toggle
    if (target.closest('.work-rest-toggle') || 
        target.closest('.duration-selector') ||
        target.closest('input') ||
        target.closest('button') ||
        target.classList.contains('drag-handle')) {
      return;
    }
    
    // Start swipe-to-delete mode
    setActiveSwipeIndex(index);
    setSwipeStartX(touch.clientX);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    // Handle drag mode (for drag-and-drop reordering)
    if (draggedIndex !== null) {
      e.preventDefault();
      setTouchDragOffset(touch.clientY - touchStartY);
      
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
      return;
    }
    
    // Handle swipe mode
    if (activeSwipeIndex !== null) {
      const deltaX = touch.clientX - swipeStartX;
      if (Math.abs(deltaX) > 10) {
        setIsDragging(true);
        e.preventDefault();
        
        // Only allow swiping left (negative deltaX)
        const swipeAmount = Math.min(0, deltaX);
        setSwipeStates(prev => ({
          ...prev,
          [activeSwipeIndex]: swipeAmount
        }));
      }
    }
  };

  const handleTouchEnd = () => {
    // Handle drag-and-drop completion
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      setCustomConfig((prev) => {
        const newSteps = [...prev.steps];
        const [removed] = newSteps.splice(draggedIndex, 1);
        newSteps.splice(dragOverIndex, 0, removed);
        return { ...prev, steps: newSteps };
      });
    }
    
    // Handle swipe completion
    if (activeSwipeIndex !== null) {
      const swipeAmount = swipeStates[activeSwipeIndex] || 0;
      const threshold = -80; // px to trigger delete reveal
      
      if (swipeAmount < threshold) {
        // Keep the swipe state - item will stay revealed
      } else {
        // Spring back to 0
        setSwipeStates(prev => ({
          ...prev,
          [activeSwipeIndex]: 0
        }));
      }
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTouchDragOffset(0);
    if (!isDragging) {
      setActiveSwipeIndex(null);
    }
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

  const handleSwipeDelete = (index: number) => {
    // Reset the swipe state and remove the step
    setSwipeStates(prev => ({
      ...prev,
      [index]: 0
    }));
    setActiveSwipeIndex(null);
    removeStep(index);
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleSimpleChange({ interval: '' as any });
                  } else {
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                      handleSimpleChange({ interval: Math.max(1, Math.min(300, num)) });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleSimpleChange({ interval: 30 });
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>Rest Interval (seconds)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={simpleConfig.rest}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleSimpleChange({ rest: '' as any });
                  } else {
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                      handleSimpleChange({ rest: Math.max(1, Math.min(300, num)) });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleSimpleChange({ rest: 10 });
                  }
                }}
              />
            </div>
            <div className="form-group inline">
              <label>Number of Rounds</label>
              <input
                type="number"
                min="1"
                max="99"
                value={simpleConfig.rounds}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleSimpleChange({ rounds: '' as any });
                  } else {
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                      handleSimpleChange({ rounds: Math.max(1, Math.min(99, num)) });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleSimpleChange({ rounds: 8 });
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="settings-form custom-mode">
            <div className="form-group inline">
              <label>Number of Rounds</label>
              <input
                type="number"
                min="1"
                max="99"
                value={customConfig.rounds}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleCustomChange({ rounds: '' as any });
                  } else {
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                      handleCustomChange({ rounds: Math.max(1, Math.min(99, num)) });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleCustomChange({ rounds: 1 });
                  }
                }}
              />
            </div>
            <div className="steps-list">
              {customConfig.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`step-swipe-container ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                >
                  {/* Delete zone (revealed on swipe) */}
                  <div className="step-delete-zone">
                    <button 
                      className="swipe-delete-btn"
                      onClick={() => handleSwipeDelete(index)}
                    >
                      Delete
                    </button>
                   </div>
                   
                  {/* Drag handle area - only on left side */}
                  <div
                    className="drag-handle-area"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      setDraggedIndex(index);
                      setTouchStartY(e.touches[0].clientY);
                      setTouchDragOffset(0);
                    }}
                    onTouchMove={(e) => {
                      if (draggedIndex === index) {
                        e.preventDefault();
                        setTouchDragOffset(e.touches[0].clientY - touchStartY);
                      }
                    }}
                    onTouchEnd={handleDragEnd}
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
                      style={{ transform: draggedIndex === index ? `translateY(${touchDragOffset}px)` : 'none' }}
                    >
                      ⋮⋮
                    </span>
                  </div>

                  {/* Step content - for swipe */}
                  <div
                    className="step-item"
                    style={{ 
                      transform: `translateX(${swipeStates[index] || 0}px)`,
                      transition: activeSwipeIndex === index ? 'none' : 'transform 0.2s ease-out'
                    }}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <span className="step-number">{index + 1}</span>
                    <div className="step-fields">
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => updateStep(index, { name: e.target.value })}
                        placeholder="Step name"
                      />
                      <div className="duration-selector">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={Math.floor(step.duration / 60)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              updateStep(index, { duration: step.duration });
                            } else {
                              const mins = parseInt(value);
                              if (!isNaN(mins)) {
                                const seconds = step.duration % 60;
                                updateStep(index, { duration: Math.max(0, Math.min(5, mins)) * 60 + seconds });
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateStep(index, { duration: step.duration });
                            }
                          }}
                        />
                        <span>:</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={step.duration % 60}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              updateStep(index, { duration: step.duration });
                            } else {
                              const secs = parseInt(value);
                              if (!isNaN(secs)) {
                                const mins = Math.floor(step.duration / 60);
                                updateStep(index, { duration: mins * 60 + Math.max(0, Math.min(59, secs)) });
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateStep(index, { duration: step.duration });
                            }
                          }}
                        />
                      </div>
                      <div className="work-rest-toggle">
                        <button
                          type="button"
                          className={step.type === 'work' ? 'active' : ''}
                          onClick={() => {
                            const newType: StepType = 'work';
                            let newName = step.name;
                            if (newName.toLowerCase() === 'rest') {
                              newName = 'Work';
                            }
                            updateStep(index, { type: newType, name: newName });
                          }}
                        >
                          Work
                        </button>
                        <button
                          type="button"
                          className={step.type === 'rest' ? 'active' : ''}
                          onClick={() => {
                            const newType: StepType = 'rest';
                            let newName = step.name;
                            if (newName.toLowerCase() === 'work') {
                              newName = 'Rest';
                            }
                            updateStep(index, { type: newType, name: newName });
                          }}
                        >
                          Rest
                        </button>
                      </div>
                    </div>
                    {/* Desktop delete button - always visible */}
                    <div className="step-actions">
                      <button onClick={() => removeStep(index)} className="delete">×</button>
                    </div>
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
