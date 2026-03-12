import { useState } from 'react';
import type { Preset, TimerConfig, SimpleConfig } from '../types';

interface PresetsProps {
  presets: Preset[];
  activeConfig: TimerConfig;
  onLoadPreset: (config: TimerConfig) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
}

export function Presets({
  presets,
  activeConfig,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
}: PresetsProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const handleSave = () => {
    if (newPresetName.trim()) {
      onSavePreset(newPresetName.trim());
      setNewPresetName('');
      setShowSaveDialog(false);
    }
  };

  // Helper to check if two simple configs match

  return (
    <div className="presets-container">
      <div className="presets-scroll">
        {activeConfig.mode === 'custom' && (
          <span className="mode-badge custom">Custom</span>
        )}
        {presets.filter(p => p.config.mode === 'simple').map((preset) => {
          const simplePreset = preset.config as SimpleConfig;
          const isActive = activeConfig.mode === 'simple' && 
            simplePreset.interval === activeConfig.interval &&
            simplePreset.rest === activeConfig.rest &&
            simplePreset.rounds === activeConfig.rounds;
          return (
            <button
              key={preset.id}
              className={`preset-chip ${isActive ? 'active' : ''}`}
              onClick={() => onLoadPreset(preset.config)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (!['hiit', 'tabata', 'simple'].includes(preset.id)) {
                  onDeletePreset(preset.id);
                }
              }}
            >
              {preset.name}
            </button>
          );
        })}
        <button className="preset-chip add" onClick={() => setShowSaveDialog(true)}>
          +
        </button>
      </div>

      {showSaveDialog && (
        <div className="save-dialog">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset name"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="dialog-actions">
            <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
            <button className="primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
