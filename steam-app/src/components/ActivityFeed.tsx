import ActivityList from './ActivityList';
import { ActivityEntry } from '../data/types';
import Icon from './Icon';

type Props = {
  data: Record<string, ActivityEntry[]>;
};

export default function ActivityFeed({ data }: Props) {
  const sortedDates = Object.keys(data).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="activity-feed text-white overflow-y-scroll hide-scrollbar w-max h-max font-mono">
      <div className='flex'>
        <Icon imageUrl='https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=000000'/>
        <Icon imageUrl='https://img.icons8.com/?size=100&id=zpXCg1p4u4Ej&format=png&color=000000'/>
      </div>
      {sortedDates.map(date => (
        <ActivityList key={date} date={date} entries={data[date]} />
      ))}
    </div>
  );
}