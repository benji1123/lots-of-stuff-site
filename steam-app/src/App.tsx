import ActivityFeed from "./components/ActivityFeed";
import ChessProfile from "./components/ChessProfile";
import RecentChessGame from "./components/LatestChessGame";
import RecentCansGrid from "./components/RecentCans";
import RecentInstagramPosts from "./components/RecentInstagramPosts";
import GitHubCommits from "./components/RecentCommits";
import { useActivityData } from "./hooks/useActivityData";
import Garden from "./components/Garden";

// chess constants
const CHESS_COM_USERNAME = "xsimplybenx";

// activity feed
const NUM_DAYS_IN_FEED = 10;

// garden
const MAX_PLANTS_TOP = 4;
const MAX_PLANTS_BOTTOM = 4;
const PLANT_WIDTH = 120;

// styles
const tileBgrnd = "rgba(18, 18, 18, 0.4)"

export default function App() {
  const data = useActivityData(NUM_DAYS_IN_FEED);

  return (
    <main className="p-[2em] flex flex-col gap-3">

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
            items-end
            lg:grid-cols-[auto_auto]
            xl:grid-cols-[auto_auto_auto]
            2xl:grid-cols-[auto_auto_auto_auto_auto]
            gap-x-3 gap-y-[1em] w-fit"
        >
          <div className="w-fit rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
            <ActivityFeed data={data} />
              <Garden
                numPlants={1}
              />
          </div>

          <div className="w-fit rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
            <RecentChessGame />
            <ChessProfile username={CHESS_COM_USERNAME} />
          </div>

          <div className="w-fit rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
            <RecentCansGrid />
          </div>

          <div className="w-fit rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
            <GitHubCommits />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-x-[1em] gap-y-[2em] w-fit">
        <div className="w-fit rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
          <RecentInstagramPosts postLimit={4}/>
        </div>
      </div>
    </main>
  );
}
