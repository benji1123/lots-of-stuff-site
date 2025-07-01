const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getCurrentDate } = require('../utils/utils');
require('dotenv').config({ path:  path.join(__dirname, '../.env') });

// Constants
const HISTORY_FILE = path.join(__dirname, 'steam-total-history.json');
const SNAPSHOT_DIR = path.join(__dirname, '../snapshots');
// const SNAPSHOT_DIR = "C:/Users/benji/Desktop/workspace/steamClient/data/snapshots";
if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR);

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_ID = process.env.STEAM_USER_ID;

const todayStr = getCurrentDate();
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const updateSteamSnapshot = async () => {
  try {
    
    const totalHistory = fs.existsSync(HISTORY_FILE)
      ? JSON.parse(fs.readFileSync(HISTORY_FILE))
      : {};
    // Fetch current Steam data
    const currentGames = await getSteamData();
    // Calculate today's minutes played per game
    const steamDataToday = currentGames
      .map((game) => {
        const previousTotal = totalHistory[game.name] || 0;
        const playedToday = game.playtime_forever - previousTotal;
        // update knows totals
        totalHistory[game.name] = game.playtime_forever;
        return {
          appid: game.appid,
          name: game.name,
          minutes_played_today: playedToday > 0 ? playedToday : 0,
          minutes_played_total: game.playtime_forever,
        };
      })
      .filter((game) => game.minutes_played_today > 0);
    
    // write updated totals to history file
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(totalHistory, null, 2));

    // Load today's snapshot if exists to preserve other sources
    const todaySnapshot = loadSnapshot(todayStr) || { date: todayStr };

    // Merge/update today's snapshot steam data, preserve other keys like strava, instagram
    const mergedSnapshot = {
      ...todaySnapshot,
      date: todayStr,
      steam: steamDataToday,
    };

    saveSnapshot(mergedSnapshot);
  } catch (err) {
    console.error('❌ Error fetching Steam data:', err.message);
  }
};

const loadSnapshot = (date) => {
  const file = path.join(SNAPSHOT_DIR, `${date}.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : null;
};

const saveSnapshot = (data) => {
  const file = path.join(SNAPSHOT_DIR, `${todayStr}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`✅ Saved snapshot: ${file}`);
};

const getSteamData = async () => {
  const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/`;
  const res = await axios.get(url, {
    params: {
      key: STEAM_API_KEY,
      steamid: STEAM_USER_ID,
    },
  });
  return res.data.response.games || [];
};

module.exports = { updateSteamSnapshot }