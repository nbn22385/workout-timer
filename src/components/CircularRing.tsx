import type { StepType } from '../types';

interface CircularRingProps {
  remainingTime: number;
  totalTime: number;
  stepType: StepType;
  stepName: string;
  size?: number;
}

const STEP_COLORS: Record<StepType, string> = {
  work: 'var(--color-work)',
  rest: 'var(--color-rest)',
  other: 'var(--color-other)',
};

export function CircularRing({
  remainingTime,
  totalTime,
  stepType,
  stepName,
  size = 280,
}: CircularRingProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? remainingTime / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = Math.floor(remainingTime % 60);
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const color = STEP_COLORS[stepType];

  return (
    <div className="circular-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle
          className="ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-ring-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-content">
        <span className="ring-time" style={{ color }}>{timeDisplay}</span>
        <span className="ring-label">{stepName}</span>
      </div>
    </div>
  );
}
