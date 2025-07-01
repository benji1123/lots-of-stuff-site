import ActivityFeed from "./components/ActivityFeed";
import ChessProfile from "./components/ChessProfile";
import RecentChessGame from "./components/LatestChessGame";
import RecentCansGrid from "./components/RecentCans";
import RecentGamePoster from "./components/RecentGamePoster";
import RecentInstagramPosts from "./components/RecentInstagramPosts";
import GitHubCommits from "./components/RecentCommits";
import { useActivityData } from "./hooks/useActivityData";

const CHESS_COM_USERNAME = 'xsimplybenx'

export default function App() {
  const data = useActivityData();

  return (
    <main className="p-[0em] ">
      <div className="top-bar flex flex-row gap-5 mb-[1em]">
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
      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-[auto_auto]
        xl:grid-cols-[auto_auto_auto]
        2xl:grid-cols-[auto_auto_auto_auto]
        gap-x-[1em] gap-y-[1em] w-fit"
      >
        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
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

      <div className="grid mt-[1em] grid-cols-1 md:grid-cols-[auto_auto_auto] gap-x-[1em] gap-y-[2em] w-fit">
        <div className="w-fit bg-[#141414] rounded-lg p-[1em]">
          <RecentInstagramPosts />
        </div>
      </div>
    </main>
  );
}
