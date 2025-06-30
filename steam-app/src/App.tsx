import ActivityFeed from "./components/ActivityFeed";
import RecentChessGame from "./components/LatestChessGame";
import RecentCansGrid from "./components/RecentCans";
import RecentGamePoster from "./components/RecentGamePoster";
import { useActivityData } from "./hooks/useActivityData";

export default function App() {
  const data = useActivityData();

  return (
    <main>
      <div className="top-bar flex flex-row gap-5">
        <img className="rounded-md" width={150} src="https://media.githubusercontent.com/media/benji1123/www.benli99.xyz/master/media/background/cyber/cyber.gif"></img>
        <div>
          <RecentGamePoster data={data} width={150} />
        </div>
      </div>
      <div className="grid p-[1em] grid grid-cols-1 md:grid-cols-[auto_auto] gap-x-[6em] gap-y-[2em] w-fit">
        <div className="w-fit">
          <ActivityFeed data={data} />
        </div>
        <div className="w-fit">
          <RecentCansGrid />
        </div>
        <div className="w-fit">
          <RecentChessGame />
        </div>
      </div>
    </main>
  );
}
