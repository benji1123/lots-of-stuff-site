const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: "../.env" });

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const tokenPath = path.resolve(__dirname, 'strava_refresh_token.txt');

function getStoredRefreshToken() {
  if (!fs.existsSync(tokenPath)) {
    throw new Error('No stored Strava refresh token found.');
  }
  return fs.readFileSync(tokenPath, 'utf-8').trim();
}

function saveRefreshToken(newToken) {
  fs.writeFileSync(tokenPath, newToken, 'utf-8');
}

async function getAccessToken() {
  const refresh_token = getStoredRefreshToken();

  const res = await axios.post('https://www.strava.com/api/v3/oauth/token', {
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    refresh_token,
    grant_type: 'refresh_token',
  });

  const { access_token, refresh_token: newRefreshToken } = res.data;

  if (newRefreshToken !== refresh_token) {
    console.log('🔁 Refresh token rotated — saving new token');
    saveRefreshToken(newRefreshToken);
  }

  return access_token;
}

module.exports = {
  getAccessToken,
};