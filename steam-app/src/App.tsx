import ActivityFeed from "./components/ActivityFeed";
import RecentChessGame from "./components/LatestChessGame";
import RecentCansGrid from "./components/RecentCans";
import RecentGamePoster from "./components/RecentGamePoster";
import { useActivityData } from "./hooks/useActivityData";

export default function App() {
  const data = useActivityData();

  return (
    <main className="p-[0em] ">
      <div className="top-bar flex flex-row gap-5 mb-[1em]">
        <img className="rounded-md" width={150} src="https://media.githubusercontent.com/media/benji1123/www.benli99.xyz/master/media/background/cyber/cyber.gif"></img>
        <div>
          <RecentGamePoster data={data} width={150} />
        </div>
      </div>
      
      {/* [tailwind] `md` means "medium" breakpoint, which applies styles to elements when the screen width >= 768px */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-x-[1em] gap-y-[2em] w-fit">
        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <ActivityFeed data={data} />
        </div>
        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <RecentChessGame />
        </div>
        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <RecentCansGrid />
        </div>
      </div>
    </main>
  );
}
