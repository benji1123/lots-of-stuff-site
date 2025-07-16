export const CHESS_COM_API_HEADERS = {
  "User-Agent": "personal-site/1.0 (benji112358@gmail.com)",
};

export const DEFAULT_CHESS_GAME = {
  url: "https://www.chess.com/game/live/1234567890",
  pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6 5. d4 exd4 6. e5 Ng4 7. Re1 O-O 8. h3 Nxf2 9. Kxf2 d3+ 10. Kg3 dxc2 11. Qxc2 d6 12. Ng5 g6 13. Bf4 Nd4 14. Qf2 Nf5+ 15. Kh2 Bxf2 16. Re2 Bg3+ 17. Bxg3 Nxg3 18. Kxg3 Qxg5+ 19. Kf2 Qh4+ 20. Kg1 Qd4+ 21. Kh2 Re8 22. Nc3 Rxe5 23. Rxe5 Qxe5+ 24. Kg1 Qd4+ 25. Kh2 Bf5 26. Rf1 Re8 27. Nb5 Qd3 28. Rxf5 Qxf5 29. Nxc7 Re1 *",
  time_control: "600",
  end_time: 1719085941,
  rated: true,
  tcn: "",
  uuid: "c320bdfa-9876-4f50-8b8e-0019f83d70fa",
  initial_setup: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  fen: "8/6k1/5n2/4p3/5b2/6Q1/PPP2PPP/4RR1K b - - 0 34",
  time_class: "rapid",
  rules: "chess",
  white: {
    username: "hikaru",
    rating: 69,
    result: "win",
    '@id': "player-uuid-1",
  },
  black: {
    username: "magnus",
    rating: 420,
    result: "checkmated",
    '@id': "player-uuid-2",
  },
};

// colors
export const GLASS_COLOR = "rgba(168, 215, 231, 0.07)";
export const GLASS_COLOR_DARKER = "rgba(234, 179, 8, 0.5)"; // "rgba(142, 176, 187, 0.01)";
// export const  = "rgba(168, 215, 231, 0.05)";
export const TILE_BG = "rgba(18, 18, 18, 0.2)";
