const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

const snapshotsDir = path.join('../data/snapshots');

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

app.get('/api/activity', (req, res) => {
  // Parse days query param, default to 7
  const days = parseInt(req.query.days) || 7;

  // Limit days to reasonable number, e.g. max 30
  const daysToFetch = Math.min(days, 30);

  const lastNDates = getLastNDates(daysToFetch);
  const combinedData = {};

  lastNDates.forEach(dateStr => {
    const filePath = path.join(snapshotsDir, `${dateStr}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        combinedData[dateStr] = JSON.parse(raw);
      } catch (err) {
        console.error(`Error reading/parsing ${dateStr}.json:`, err);
        combinedData[dateStr] = [];
      }
    } else {
      combinedData[dateStr] = [];
    }
  });
  console.log(JSON.stringify(combinedData));
  res.json(combinedData);
});

/**
 * return the last 10 can events
 */
app.get('/api/cans/recent', (req, res) => {
  const filePath = path.join(__dirname, '../data/cans/can_counts.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Can data file not found' });
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const canData = JSON.parse(raw);
    const cans = canData.counts || [];

    // Get the limit from the query string, default to 10, max 20
    const limit = Math.min(parseInt(req.query.limit) || 10, 20);

    // Return newest first
    const recentCans = cans.slice(-limit);
    res.json(recentCans);
  } catch (err) {
    console.error('Error reading can data:', err);
    res.status(500).json({ error: 'Failed to read can data' });
  }
});

// serve the images and other static files in the /pulbic/ directory
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});