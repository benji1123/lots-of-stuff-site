import { ActivityEntry } from '../data/types';

type Props = {
  data: Record<string, ActivityEntry[]>;
};

export default function RecentGamePoster({ data }: Props) {

    // Flatten all entries in reverse chronological order
  const sortedDates = Object.keys(data).sort((a, b) => (a > b ? -1 : 1));
  const allEntries = sortedDates.flatMap(date => data[date]);
  // Find the first Steam activity
  const firstSteam = allEntries.find(entry => entry.source === 'steam');
  

  return (
    <div className="activity-feed bg-black text-white overflow-y-scroll hide-scrollbar w-max h-max font-mono">
      <a href={firstSteam?.url} target='_blank'>
        <img src={firstSteam?.gamePosterUrl}/>
      </a>
    </div>
  );
}