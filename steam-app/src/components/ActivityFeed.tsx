import ActivityList from './ActivityList';
import { ActivityEntry } from '../data/types';

type Props = {
  data: Record<string, ActivityEntry[]>;
};

export default function ActivityFeed({ data }: Props) {
  const sortedDates = Object.keys(data).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="activity-feed text-white overflow-y-scroll hide-scrollbar w-max h-max font-mono">
      {sortedDates.map(date => (
        <ActivityList key={date} date={date} entries={data[date]} />
      ))}
    </div>
  );
}