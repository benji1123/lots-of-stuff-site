const { updateSteamSnapshot } = require('./steam/fetchSteamSnapshot');
const { updateStravaSnapshot } = require('./strava/fetchStravaSnapshot');

/**
 * single script that runs all Snapshot jobs (steam, strava)
 */
async function runJobs() {
    try {
        console.log('Running Steam data job...');
        await updateSteamSnapshot();
        console.log('Steam data job completed.');

        console.log('Running Strava data job...');
        await updateStravaSnapshot();
        console.log('Strava data job completed.');
    } catch (error) {
        console.error('Error running jobs:', error);
        process.exit(1);
    }
}

runJobs();