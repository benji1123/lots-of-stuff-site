import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { CHESS_COM_API_HEADERS, DEFAULT_CHESS_GAME } from '../constants';

const USERNAME = 'xsimplybenx'; // Replace with your Chess.com username
const MOVE_SPEED_MS = 3000; // Speed of move animation in milliseconds

type GameInfo = {
  url: string;
  white: PlayerInfo;
  black: PlayerInfo;
  time_class: string;
  end_time: number;
  pgn: string;
};

type PlayerInfo = {
  username: string;
  result: string;
  rating?: number;
  "@id": string;
};

const INITIAL_BOARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const BOARD_WIDTH = 300; // Width of the chessboard in pixels

// initialize a placeholder game since chess.com api is unreliable
// once my game is fetched, it will replace the placeholder
const PLACEHOLDER_GAME = new Chess()
PLACEHOLDER_GAME.loadPgn(DEFAULT_CHESS_GAME.pgn)
const PLACEHOLDER_MOVES = PLACEHOLDER_GAME.history()

export default function AnimatedChessGame() {
  const [currentFen, setCurrentFen] = useState(INITIAL_BOARD_FEN);
  const [moves, setMoves] = useState<string[]>(PLACEHOLDER_MOVES);
  const [moveIndex, setMoveIndex] = useState(0);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(DEFAULT_CHESS_GAME);

  useEffect(() => {
    async function fetchGame() {
      const archivesRes = await fetch(`https://api.chess.com/pub/player/${USERNAME}/games/archives`, {
        headers: CHESS_COM_API_HEADERS
      });
      const archiveUrls = await archivesRes.json();
      const latestUrl = archiveUrls.archives.pop();
      const gamesRes = await fetch(latestUrl, {
        headers: CHESS_COM_API_HEADERS,
      });
      let allGames = (await gamesRes.json()).games;
      if (allGames.length > 0) {
        const game = allGames[allGames.length - 1];
        const chess = new Chess();
        console.log(game.pgn)
        chess.loadPgn(game.pgn);
        setMoves(chess.history());
        setGameInfo(game);
      }
    }
    fetchGame();
  }, []);

  // Animation effect
  useEffect(() => {
    if (moves.length === 0 || moveIndex >= moves.length) return;

    const timer = setTimeout(() => {
      const chess = new Chess(currentFen);
      try {
        chess.move(moves[moveIndex]);
        setCurrentFen(chess.fen());
        setMoveIndex(moveIndex + 1);
      } catch (e) {
        console.error('Invalid move:', moves[moveIndex], e);
        // Skip invalid move and try next one
        setMoveIndex(moveIndex + 1);
      }
    }, MOVE_SPEED_MS);

    return () => clearTimeout(timer);
  }, [moves, moveIndex, currentFen]);

  if (!gameInfo) return <div className="font-mono text-xs p-[1em]">Loading chess game...</div>;

  const endDate = new Date(gameInfo.end_time * 1000).toLocaleString([], {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  // styles for palyer metadata
  const whiteStyles = RESULT_STYLES[gameInfo.white.result] || DEFAULT_STYLE;
  const blackStyles = RESULT_STYLES[gameInfo.black.result] || DEFAULT_STYLE;

  return (
    <div className="max-w-2xl mx-auto rounded-lg">
      <div className="flex flex-row gap-6">
        {/* print moves (anchor scroll at bottom of container via flex and flex-col-reverse
            https://dev.to/hugaidas/anchor-scroll-at-the-bottom-of-the-container-with-dynamic-content-2knj) */}
          {/* set max-height to board width (pixels) because scoresheet should be flush with chessboard*/}
          <div
            id="scoresheet"
            className={`flex flex-col-reverse min-w-[15em] max-h-[300px] bg-[#000000] p-[1em]
                        rounded-xl text-xs font-mono flex-1 overflow-y-auto hide-scrollbar`}
          >
            <table>
              <tbody>
                {Array.from({ length: Math.ceil(moveIndex / 2) }, (_, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="pr-2 text-gray-400">{rowIdx + 1}.</td>
                    <td className={moveIndex === rowIdx * 2 ? "bg-blue-700 rounded px-2" : "px-2"}>
                      {moves[rowIdx * 2]}
                    </td>
                    <td className={moveIndex === rowIdx * 2 + 1 ? "bg-blue-700 rounded px-2" : "px-2"}>
                      {moves[rowIdx * 2 + 1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
        {/* animate the chess game */}
        <div className="flex flex-col mb-3">
          <Chessboard 
            position={currentFen}
            arePiecesDraggable={false} 
            boardWidth={BOARD_WIDTH}
            showBoardNotation={true}
            // mimic Chess.com board: https://react-chessboard.vercel.app/?path=/story/chessboard--styled-board
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
            }}
            customDarkSquareStyle={{
              backgroundColor: "#141414"
            }}
            customLightSquareStyle={{
              backgroundColor: "#779952"
            }}
          />
        </div>
      </div>

      {/* show the player names and results */}
       <div className="text-xs font-mono my-2">
            <div>
              <span className={`${whiteStyles.color}`}>White: </span>
              <a href={getProfileUrl(gameInfo.white.username)} target="_blank" className="text-blue-400">{gameInfo.white.username}</a>
              {' '}({gameInfo.white.rating}) {whiteStyles.emoji}
            </div>
            <div>
              <span className={`${blackStyles.color}`}>Black: </span>
              <a href={getProfileUrl(gameInfo.black.username)} target="_blank" className="text-blue-400">{gameInfo.black.username}</a>
              {' '}({gameInfo.black.rating}) {blackStyles.emoji}
            </div>
            <div>
              {endDate} <a href={gameInfo.url} target="_blank" className="text-blue-400">(see game)</a>
            </div>
          </div>
    </div>
  );
}


type ResultStyle = {
  emoji: string;
  color: string;
};

const DEFAULT_STYLE: ResultStyle = { emoji: '❓', color: 'text-gray-500' };
const RESULT_STYLES: Record<string, ResultStyle> = {
  win: { emoji: '✅', color: 'text-green-400' },
  checkmated: { emoji: '♟️', color: 'text-red-500' },
  agreed: { emoji: '🤝', color: 'text-yellow-300' },
  repetition: { emoji: '🔁', color: 'text-yellow-300' },
  timeout: { emoji: '⏰', color: 'text-red-400' },
  resigned: { emoji: '🏳️', color: 'text-red-500' },
  stalemate: { emoji: '⛔', color: 'text-gray-400' },
  lose: { emoji: '❌', color: 'text-red-400' },
  insufficient: { emoji: '➖', color: 'text-gray-400' },
  '50move': { emoji: '📏', color: 'text-gray-400' },
  abandoned: { emoji: '🚪', color: 'text-gray-500' },
  kingofthehill: { emoji: '👑', color: 'text-purple-400' },
  threecheck: { emoji: '⚡', color: 'text-purple-400' },
  timevsinsufficient: { emoji: '⏳➖', color: 'text-gray-400' },
  bughousepartnerlose: { emoji: '🪳', color: 'text-pink-400' },
};

const getProfileUrl = (username: string) => {
  return `https://www.chess.com/member/${username}`;
};
