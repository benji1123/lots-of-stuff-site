const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const instagramRoutes = require('./routes/instagram')

const PORT = 5000;

const CANS_FILE_PATH = path.join(__dirname, "../data/cans/can_counts.json");
const SNAPSHOTS_DIR = path.join("../data/snapshots");

// put this before routes to suppost JSON in request bodies
app.use(express.json());

// routes in external files
app.use(instagramRoutes)

/**
 * Fetch the strava activities for the past N days (defaults to 7).
 * This API does not contain detailled activity info (i.e. description)
 * @returns {Object} JSON object with date keys and array of activities for that date
 * {
      "2025-06-24": {
        "date": "2025-06-24",
        "steam": [
            {
            "appid": 3489700,
            "name": "Stellar Blade™",
            "minutes_played_today": 38,
            "minutes_played_total": 1840
          }
        ],
        "strava": [
          {
            "id": 14906781228,
            "title": "Stanley Park",
            "type": "Run",
            "metricValue": "5.03",
            "metricLabel": "km",
            "time": 34,
            "date": "2025-06-24T17:20:11Z",
            "description": "",
            "url": "https://www.strava.com/activities/14906781228",
            "elevationGain": 0,
            "elapsedTime": 2096
          }
        ]
      },
      "2025-06-23": {...}
  }
 */
app.get("/api/activity", (req, res) => {
  // Parse days query param, default to 7
  const days = parseInt(req.query.days) || 7;

  // Limit days to reasonable number, e.g. max 30
  const daysToFetch = Math.min(days, 30);

  const lastNDates = getLastNDates(daysToFetch);
  const combinedData = {};

  lastNDates.forEach((dateStr) => {
    const filePath = path.join(SNAPSHOTS_DIR, `${dateStr}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        combinedData[dateStr] = JSON.parse(raw);
      } catch (err) {
        console.error(`Error reading/parsing ${dateStr}.json:`, err);
        combinedData[dateStr] = [];
      }
    } else {
      combinedData[dateStr] = [];
    }
  });
  console.log(`returning activities`);
  res.json(combinedData);
});

/**
 * This API returns the most recent can counts, limited to a maximum of 30 cans.
 * Eacn object includes can name, count, and image URL.
 * 
    [
      {
        "name": "Pocari",
        "count": 6,
        "image": "https://api.ben-feed.cc/static/cans/pocari.png"
      },
      {
        "name": "Asahi",
        "count": 8,
        "image": "https://api.ben-feed.cc/static/cans/asahi.png"
      },
      ...
    ]
 */
const MAX_CANS = 30;
app.get("/api/cans/recent", (req, res) => {
  if (!fs.existsSync(CANS_FILE_PATH)) {
    return res.status(404).json({ error: "Can data file not found" });
  }

  try {
    const raw = fs.readFileSync(CANS_FILE_PATH, "utf-8");
    const canData = JSON.parse(raw);
    const cans = canData.counts || [];

    // Get the limit from the query string, default to 10, max 20
    const limit = Math.min(parseInt(req.query.limit) || 10, MAX_CANS);

    // Return newest first
    const recentCans = cans.slice(-limit);
    res.json(recentCans);
  } catch (err) {
    console.error("Error reading can data:", err);
    res.status(500).json({ error: "Failed to read can data" });
  }
});

/**
 * change the can-count for a given can
 */
app.post("/api/cans/update", (req, res) => {
  console.log(req.body)
  const { name, delta } = req.body;

  if (!name || typeof delta !== "number") {
    return res.status(400).json({ error: "Missing or invalid name/delta" });
  }

  let data = { counts: [] };
  if (fs.existsSync(CANS_FILE_PATH)) {
    data = JSON.parse(fs.readFileSync(CANS_FILE_PATH, "utf-8"));
  }

  let can = data.counts.find((c) => c.name === name);

  if (!can) {
    return;
  } else {
    can.count = Math.max(0, can.count + delta);
  }
  fs.writeFileSync(CANS_FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ success: true, updated: can });
});

// Helper: get last N dates as strings in YYYY-MM-DD format
function getLastNDates(n) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10)); // "YYYY-MM-DD"
  }
  return dates;
}

// serve the images and other static files in the /pulbic/ directory
app.use("/static", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
