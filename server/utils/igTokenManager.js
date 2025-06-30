const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const TOKEN_FILE = path.join(
  __dirname,
  "..",
  ".secrets",
  "instagram-token.json"
);

const REFRESH_BUFFER_SECONDS = 86400 * 10; // Refresh if <10 days left

function loadToken() {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_FILE));
}

function saveToken(tokenData) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  let token = loadToken();
  if (!token || now > token.expiresAt - REFRESH_BUFFER_SECONDS) {
    console.log("🔄 Refreshing Instagram token...");
    const res = axios.get("https://graph.instagram.com/refresh_access_token", {
      params: {
        grant_type: "ig_refresh_token",
        access_token: token?.access_token || process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    });
    token = {
      access_token: res.data.access_token,
      expires_at: now + res.data.expires_in,
    };
    saveToken(token);
  }
}

module.exports = { getAccessToken };
