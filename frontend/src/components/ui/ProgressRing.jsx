import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ProgressRing({ value = 0, size = 48 }) {
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: color,
          textColor: '#0F172A',
          trailColor: '#E2E8F0',
          textSize: '28px',
        })}
      />
    </div>
  );
}
