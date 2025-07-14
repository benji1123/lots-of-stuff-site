import ActivityFeed from "./components/ActivityFeed";
import ChessProfile from "./components/ChessProfile";
import RecentChessGame from "./components/LatestChessGame";
import RecentCansGrid from "./components/RecentCans";
import RecentInstagramPosts from "./components/RecentInstagramPosts";
import GitHubCommits from "./components/RecentCommits";
import { useActivityData } from "./hooks/useActivityData";
import Garden from "./components/Garden";
import StatusBar from "./components/StatusBar";
import { ActivityEntry } from "./data/types";
import { ReactNode } from "react";

// chess constants
const CHESS_COM_USERNAME = "xsimplybenx";

// activity feed
const NUM_DAYS_IN_FEED = 10;

// instagram
const POST_LIMIT = 4;

// styles
const tileBgrnd = "rgba(18, 18, 18, 0.2)";

export default function App() {
  const data = useActivityData(NUM_DAYS_IN_FEED);

  return (
    <main className="p-[2em] flex flex-col gap-3">
      <StatusBar />

      {/* Main grid layout: left = RecentCansGrid, right = rest */}
      <div
        className="
            outermost-grid
            relative grid
            grid-cols-1
            md:grid-cols-[auto_1fr]
            items-start
            gap-x-6 gap-y-[1em] w-fit"
      >
        {/* Left column: RecentCansGrid */}
        <div
          className="outermost-left-col rounded-lg p-[1em]"
          style={{ background: tileBgrnd }}
        >
          <RecentCansGrid />
        </div>

        {/* Right column: rest of the dashboard */}
        <div className="outermost-right-col flex flex-col gap-3">
          {getRow1(data)}
          {getRow2()}
        </div>
      </div>
    </main>
  );
}

function getRow1(data: Record<string, ActivityEntry[]>) {
  return (
    <div
      // optimize # cols for screen-width
      className="
                relative grid
                grid-cols-1
                lg:grid-cols-[auto_auto]
                xl:grid-cols-[auto_auto_auto]
                2xl:grid-cols-[auto_auto_auto_auto_auto]
                gap-x-3 gap-y-[1em] items-end"
    >
      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <ActivityFeed data={data} />
        <Garden numPlants={2} />
      </div>

      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <RecentChessGame />
        <ChessProfile username={CHESS_COM_USERNAME} />
      </div>

      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <RecentInstagramPosts accountAlias="GRASS" postLimit={POST_LIMIT} />
      </div>

      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <GitHubCommits />
      </div>
    </div>
  );
}

function getRow2() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_auto_auto_auto_auto] gap-x-[1em] gap-y-[2em]">
      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <RecentInstagramPosts accountAlias="SPEAKEASY" postLimit={POST_LIMIT} />
      </div>

      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <RecentInstagramPosts accountAlias="CAFE" postLimit={POST_LIMIT} />
      </div>

      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <RecentInstagramPosts accountAlias="DRAW" postLimit={6} />
      </div>

      <div className="rounded-lg p-[1em]" style={{ background: tileBgrnd }}>
        <RecentInstagramPosts accountAlias="FOOD" postLimit={POST_LIMIT} />
      </div>
    </div>
  );
}
