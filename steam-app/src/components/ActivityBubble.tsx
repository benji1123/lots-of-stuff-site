import { ActivityEntry } from '../data/types';

export default function ActivityBubble({ entry }: { entry: ActivityEntry }) {
  const emoji = entry.emoji || '';
  const color = entry.color || '#6b7280'; // default: gray-500

  return (
    <div className="activity-bubble text-xs flex items-center max-w-lg rounded-2xl pl-4">
      <div className="items-center space-x-2" style={{ color: 'gray' }}>
        {/* <span className="">[{entry.source}]</span> */}
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

/** since you can't specify alpha for HEX colors */
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}