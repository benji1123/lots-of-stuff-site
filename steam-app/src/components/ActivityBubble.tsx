import { ActivityEntry } from '../data/types';

export default function ActivityBubble({ entry }: { entry: ActivityEntry }) {
  const emoji = entry.emoji || '';
  const color = entry.color || '#6b7280'; // default: gray-500

  return (
    <div className="activity-bubble text-xs flex items-center rounded-2xl max-w-[20em] ">
      <div className="items-center space-x-1" style={{ color: 'gray' }}>
        {/* <span className="">[{entry.source}]</span> */}
        <span className="metric text-gray-300 font-bold">
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