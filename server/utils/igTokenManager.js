const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const TOKEN_FILE = path.join(__dirname, "..", ".secrets", "instagram-tokens.json");
const REFRESH_BUFFER_SECONDS = 86400 * 10; // 10 days

// Load all tokens from file
function loadAllTokens() {
  if (!fs.existsSync(TOKEN_FILE)) return {};
  return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
}

// Save all tokens to file
function saveAllTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

// Load token for a specific account
function loadToken(accountAlias) {
  const tokens = loadAllTokens();
  return tokens[accountAlias] || null;
}

// Save token for a specific account
function saveToken(accountAlias, tokenData) {
  const tokens = loadAllTokens();
  tokens[accountAlias] = tokenData;
  saveAllTokens(tokens);
}

/**
 * Steps to onboard a new instagram account:
 * 1. generate an API token in the Meta Developer portal
 * 2. add token to the .env file `INSTAGRAM_ACCESS_TOKEN_{accountAlias}=XXXXX`
 * you can now fetch its token with this function: getAccessToken(accountAlias) 
*/
async function getAccessToken(accountAlias) {
  const now = Math.floor(Date.now() / 1000);
  let token = loadToken(accountAlias);

  const fallbackToken = process.env[`INSTAGRAM_ACCESS_TOKEN_${accountAlias}`];

  if (!token || now > token.expires_at - REFRESH_BUFFER_SECONDS) {
    console.log(`🔄 Refreshing Instagram token for ${accountAlias}...`);

    const res = await axios.get("https://graph.instagram.com/refresh_access_token", {
      params: {
        grant_type: "ig_refresh_token",
        access_token: token?.access_token || fallbackToken,
      },
    });

    token = {
      access_token: res.data.access_token,
      expires_at: now + res.data.expires_in,
    };

    saveToken(accountAlias, token);
  }

  return token.access_token;
}

module.exports = { getAccessToken };