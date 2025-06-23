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
    <div className="activity-list">
      {/* Date heading */}
      <h2 className="text-sm text-gray-400 mb-2">{date}</h2>

      {/* Feed-style activity messages */}
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-gray-600 text-xs italic">No activity</p>
        ) : (
          entries.map(entry => (
            <ActivityBubble
              key={`${entry.source}-${entry.id}-${date}`}
              entry={entry}
            />
          ))
        )}
      </div>
    </div>
  );
}