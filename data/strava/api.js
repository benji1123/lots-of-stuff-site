const axios = require('axios');
const { getAccessToken } = require('./tokenManager');

async function getStravaActivities() {
  const accessToken = await getAccessToken();
  const res = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      per_page: 3,
    },
  });

  return res.data;
}

const ss = getStravaActivities();

module.exports = {
  getStravaActivities,
};