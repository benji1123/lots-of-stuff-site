import ActivityFeed from './components/ActivityFeed';
import RecentChessGame from './components/LatestChessGame';
import RecentCansGrid from './components/RecentCans';
import RecentGamePoster from './components/RecentGamePoster';
import { useActivityData } from './hooks/useActivityData';

export default function App() {
  const data = useActivityData();

  return <main className="p-[1em] grid grid-cols-1 md:grid-cols-[auto_auto] gap-x-[6em] gap-y-[2em] w-fit">
      <div className='w-fit'>
        <ActivityFeed data={data} />
      </div>
      <div className='w-fit'>
        <RecentCansGrid />
      </div>
      <div className='w-fit'>
        <RecentChessGame/>
      </div>
      <div>
        <RecentGamePoster data={data}/>
      </div>
    </main>
}