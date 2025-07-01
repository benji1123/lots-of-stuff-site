import { ActivityEntry } from '../data/types';
import ActivityBubble from './ActivityBubble';

type Props = {
  date: string;
  entries: ActivityEntry[];
};

/**
 * renders the activities for a single date
 */
export default function ActivityList({ date, entries }: Props) {
  return (
    entries.length == 0 ? <div></div> :
    <div className="activities-for-date">
      {/* Date heading */}
      <div className="text-xs text-green-400 mt-4 mb-1">{date}</div>

      {/* Feed-style activity messages */}
      <div>
          {entries.map(entry => (
            <ActivityBubble
              key={`${entry.source}-${entry.id}-${date}`}
              entry={entry}
            />
          ))}
      </div>
    </div>
  );
}