import ActivityFeed from "./components/ActivityFeed";
import ChessProfile from "./components/ChessProfile";
import RecentChessGame from "./components/LatestChessGame";
import RecentCansGrid from "./components/RecentCans";
import RecentGamePoster from "./components/RecentGamePoster";
import RecentInstagramPosts from "./components/RecentInstagramPosts";
import GitHubCommits from "./components/RecentCommits";
import { useActivityData } from "./hooks/useActivityData";
import Garden from "./components/Garden";

const CHESS_COM_USERNAME = 'xsimplybenx'
const NUM_DAYS_IN_FEED = 10;

export default function App() {
  const data = useActivityData(NUM_DAYS_IN_FEED);

  return (
    <main className="p-[0em] flex flex-col gap-3">
      <div className="top-bar flex flex-row gap-5">
        {/* cyberpunk image */}
        <img
          className="rounded-md"
          width={150}
          src="https://media.githubusercontent.com/media/benji1123/www.benli99.xyz/master/media/background/cyber/cyber.gif"
        ></img>
        <div>
          <RecentGamePoster data={data} width={150} />
        </div>
      </div>

      {/* Grid - feed, chess, cans, and github */}
      <div className="relative w-fit">
        {/* <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 via-purple-800 to-blue-800 opacity-45 blur"></div> */}
        <div
          // number of columns depends on screen-width
          //    [auto_auto] = 2 auto-sized columns
          //    [auto_auto_auto] = 3 auto-sized columns
          //    and so on 
          className="
            relative grid
            grid-cols-1
            lg:grid-cols-[auto_auto]
            xl:grid-cols-[auto_auto_auto]
            2xl:grid-cols-[auto_auto_auto_auto]
            gap-x-3 gap-y-[1em] w-fit">
        <div className="w-fit bg-[#121212] rounded-lg p-[1em]">
          <ActivityFeed data={data} />
        </div>

        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <RecentChessGame />
          <ChessProfile username={CHESS_COM_USERNAME} />
        </div>

        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <RecentCansGrid />
        </div>

        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <GitHubCommits />
        </div>
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-x-[1em] gap-y-[2em] w-fit">
        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <RecentInstagramPosts />
        </div>
      </div>
      <Garden numPlants={Math.min(20, Math.floor(window.innerWidth/120))} />
    </main>
  );
}
