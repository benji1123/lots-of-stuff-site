import { ActivityEntry } from '../data/types';

export default function ActivityBubble({ entry }: { entry: ActivityEntry }) {
  const emoji = entry.emoji || '❔';
  const color = entry.color || '#6b7280'; // default: gray-500

  return (
    <div
      className="activity-bubble flex items-center max-w-lg shadow-md rounded-2xl px-4 py-1 mb-1"
      style={{
        backgroundColor: hexToRgba(color, 0.07),
        // border: `1px solid ${hexToRgba(color, 0.2)}`,
      }}
    >
      <div className="flex flex-wrap items-center space-x-2" style={{ color }}>
        <span className="emoji text-xl">{emoji}</span>
        <span className="title font-semi text-sm">{entry.title}</span>
        {entry.metricValue !== undefined && (
          <span className="text-sm text-gray-300">
            — {entry.metricValue} {entry.metricLabel}
          </span>
        )}
      </div>
    </div>
  );
}

/** to decrease opacity of given color */
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}