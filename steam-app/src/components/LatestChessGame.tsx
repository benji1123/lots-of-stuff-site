import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const USERNAME = 'xsimplybenx'; // Replace with your Chess.com username
const MOVE_SPEED_MS = 2000; // Speed of move animation in milliseconds

type PlayerInfo = {
  username: string;
  result: string;
  rating?: number;
  "@id": string;
};

type GameInfo = {
  url: string;
  white: PlayerInfo;
  black: PlayerInfo;
  time_class: string;
  end_time: number;
  pgn: string;
};

const INITIAL_BOARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function AnimatedChessGame() {
  const [currentFen, setCurrentFen] = useState(INITIAL_BOARD_FEN);
  const [moves, setMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  useEffect(() => {
    async function fetchGame() {
      const archivesRes = await fetch(`https://api.chess.com/pub/player/${USERNAME}/games/archives`);
      const archiveUrls = await archivesRes.json();
      const latestUrl = archiveUrls.archives.pop();
      const gamesRes = await fetch(latestUrl);
      const allGames = (await gamesRes.json()).games;

      if (allGames.length > 0) {
        const game = allGames[allGames.length - 1];
        const chess = new Chess();
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

  if (!gameInfo) return <div className="text-white">Loading chess game...</div>;

  const endDate = new Date(gameInfo.end_time * 1000).toLocaleString([], {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const whiteStyles = RESULT_STYLES[gameInfo.white.result] || DEFAULT_STYLE;
  const blackStyles = RESULT_STYLES[gameInfo.black.result] || DEFAULT_STYLE;

  return (
    <div className="max-w-md mx-auto text-white rounded-lg p-4 shadow-lg">
      <div className="flex flex-col items-center mb-3">
        <Chessboard 
          position={currentFen}
          arePiecesDraggable={false} 
          boardWidth={280} 
        />
      </div>
      <div className="text-sm space-y-1 px-1">
        <div><span className={`${whiteStyles.color}`}>White: </span><a href={getProfileUrl(gameInfo.white.username)} target="_blank" className="text-blue-400">{gameInfo.white.username}</a> ({gameInfo.white.rating}) {whiteStyles.emoji}</div>
        <div><span className={`${blackStyles.color}`}>Black: </span><a href={getProfileUrl(gameInfo.black.username)} target="_blank" className="text-blue-400">{gameInfo.black.username}</a> ({gameInfo.black.rating}) {blackStyles.emoji}</div>
        <div><span className="text-gray-400"></span>{endDate} <a href={gameInfo.url} target="_blank" className="text-blue-400">(see game)</a></div>
        <div></div>
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
