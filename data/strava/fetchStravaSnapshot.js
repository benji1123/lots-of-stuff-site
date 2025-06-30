const fs = require('fs');
const path = require('path');
const { getAccessToken } = require('./tokenManager');
const axios = require('axios');
const { getCurrentDate } = require('../utils/utils');
const { act } = require('react');

const NUM_ACTIVITIES_TO_FETCH = 5;
const SNAPSHOT_DIR = path.join(__dirname, '../snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR);


const currDate = getCurrentDate();
// const currDate = "2025-06-28";
const snapshotFile = path.join(SNAPSHOT_DIR, `${currDate}.json`);

/**
 * @returns the activities of the authenticated athlete
 */
async function fetchStravaActivities() {
  const accessToken = await getAccessToken();
  const res = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { per_page: NUM_ACTIVITIES_TO_FETCH },
  });
  return res.data;
}

/**
 * @returns rolled up activity stats for the authenticated athlete
 * https://developers.strava.com/docs/reference/#api-models-ActivityStats
 * https://www.strava.com/api/v3/athletes/103168864/stats
 */
const STRAVA_USER_ID = 103168864; // must match authenticated user
async function fetchAtheleteStats() {
  const accessToken = await getAccessToken();
  const res = await axios.get(`https://www.strava.com/api/v3/athletes/${STRAVA_USER_ID}/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

async function updateStravaSnapshot() {
  // Load existing snapshot or empty
  let snapshot = {};
  if (fs.existsSync(snapshotFile)) {
    try {
      snapshot = JSON.parse(fs.readFileSync(snapshotFile, 'utf-8'));
    } catch {
      snapshot = {};
    }
  }

  // Fetch strava activities
  const activities = await fetchStravaActivities();
  const athleteStats = await fetchAtheleteStats();

  // Map to your format
  const stravaData = activities
    .filter(act => act.start_date_local.slice(0, 10) == currDate) // filter by today's date
    .map(act => ({
      id: act.id,
      title: act.name,
      type: act.sport_type,
      metricValue: (act.distance / 1000).toFixed(2),
      lifetimeValue: 1000,
      metricLabel: 'km',
      time: Math.trunc(act.elapsed_time / 60), // divide by 60 to get minutes
      date: act.start_date_local,
      activityTotal: getActivityTotal(act.sport_type, athleteStats),
      url: `https://www.strava.com/activities/${act.id}`,
      elevationGain: (act.total_elevation_gain || 0), // in meters
      elapsedTime: act.elapsed_time, // in seconds
    }));

  // Merge into snapshot
  snapshot.date = currDate;        // update date field
  snapshot.strava = stravaData;    // add or overwrite strava

  // Save back to file
  fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));

  console.log(`✅ Updated strava snapshot in ${snapshotFile}`);
}

const getActivityTotal = (activityType, athleteStats) => {
  activityType = activityType.toLowerCase()
  if (activityType == 'run') {
    return athleteStats.all_run_totals;
  } else if (activityType == 'ride') {
    return athleteStats.all_ride_totals;
  } else if (activityType == 'swim') {
    return athleteStats.all_swim_totals;
  }
  // TODO strava does not return totals for other activities, 
  // so implement my own running total
  return {};
}

module.exports = { updateStravaSnapshot };