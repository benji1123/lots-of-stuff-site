const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "..", ".secrets");
const TTL_MINUTES = 30;
const TTL_SECONDS = 60 * TTL_MINUTES;

function getCachePath(name) {
  return path.join(CACHE_DIR, `${name}_cache.json`);
}

function loadCache(name) {
  const file = getCachePath(name);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file));
  if (Date.now() - data.cachedAt > TTL_SECONDS * 1000) return null;
  return data.payload;
}

function saveCache(name, payload) {
  const file = getCachePath(name);
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        cachedAt: Date.now(),
        payload,
      },
      null,
      2
    )
  );
}

module.exports = { loadCache, saveCache };
