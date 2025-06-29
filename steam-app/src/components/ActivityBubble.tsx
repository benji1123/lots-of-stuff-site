import { ActivityEntry } from '../data/types';

export default function ActivityBubble({ entry }: { entry: ActivityEntry }) {
  const emoji = entry.emoji || '';
  const color = entry.color || '#6b7280'; // default: gray-500

  return (
    <div
      className="activity-bubble text-xs flex items-center max-w-lg shadow-md rounded-2xl px-4 py-1 mb-1"
      style={{
        backgroundColor: hexToRgba(color, 0.2),
        // border: `1px solid ${hexToRgba(color, 0.2)}`,
      }}
    >
      <div className="items-center space-x-2" style={{ color: 'gray' }}>
        <span className="">[{entry.source}]</span>
        <span className="text-gray-300">
          {entry.metric}
        </span>
        <span className="emoji">{emoji}</span>
        <a href={entry.url} target='_blank'>
          <span className="title text-blue-400">{entry.title}</span>
        </a>
        <span className="emoji">{entry.description}</span>
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