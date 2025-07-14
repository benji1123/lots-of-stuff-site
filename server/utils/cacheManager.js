/**
 * Caches JSON-data in the .secrets folder.
 * Exposes APIs for loading the cache and saving to it.
 * Uses a standard TTL of 24-HOURS since i rarely post on IG. 
 */

const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "..", ".secrets");

const TTL_HOURS = 24;
const TTL_SECONDS = 60 * 60 * TTL_HOURS;

function getCachePath(name) {
  return path.join(CACHE_DIR, `${name}_cache.json`);
}

function loadCache(jsonFilename) {
  const file = getCachePath(jsonFilename);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file));
  if (Date.now() - data.cachedAt > TTL_SECONDS * 1000) return null;
  console.log(`cache has expired for ${jsonFilename}`)
  return data.payload;
}

function saveCache(jsonFilename, payload) {
  const file = getCachePath(jsonFilename);
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
