import { ActivityEntry } from './types';

/** example Steam entry
 * {
      "appid": 1621140,
      "name": "Clawfish",
      "minutes_played_today": 38,
      "minutes_played_total": 38
    }
 */
export function mapSteam(entry: any): ActivityEntry {
  return {
    id: entry.appid,
    title: entry.name,
    metricValue: entry.minutes_played_today, // convert minutes to hours
    metricLabel: 'min played',
    source: 'steam',
    color: '#9147ff', // twitch purple
    emoji: '🎮'
  };
}

/** example Strava entry
 * {
      "id": 14855893377,
      "title": "Boxing Fundamentals 3",
      "type": "Workout",
      "metricValue": "0.00",
      "metricLabel": "km",
      "time": 50,
      "date": "2025-06-20T01:30:57Z"
    }
 */
export function mapStrava(entry: any): ActivityEntry {
  const metricValue = entry.metricValue > 0 ? entry.metricValue : entry.time
  const metricLabel = entry.metricValue > 0 ? "km" : "min"
  const activityConfig = STRAVA_ACTIVITY_CONFIG_MAP[entry.type.toLowerCase()];
  return {
    id: entry.appid,
    title: `${entry.title}`,
    metricValue,
    metricLabel: metricLabel + " " + entry.type.toLowerCase(),
    source: 'strava',
    color: activityConfig?.color || '#fc4c02', // strava vermillion
    emoji: activityConfig?.emoji || '🏋️',
  };
}

// strava types defined in https://developers.strava.com/docs/reference/#api-models-SportType
const STRAVA_ACTIVITY_CONFIG_MAP: Record<string, any> = {
  'workout': { 'emoji': '🥊', color: '#ff0000'},
  'run': { 'emoji': '👟', color: '#ff69b4' },
  'ride': { 'emoji': '🚲', color: '#00adee' },
  'swim': { 'emoji': '🏊', color: '#00adee' },
  'hike': { 'emoji': '🥾', color: '#4caf50' },
  'walk': { 'emoji': '🚶', color: '#4caf50' },
  'gym': { 'emoji': '🏋️', color: '#9c27b0' },
  'yoga': { 'emoji': '🧘', color: '#ff9800' },
  'canoeing': { 'emoji': '🛶', color: '#2196f3' },
  'kayaking': { 'emoji': '🛶', color: '#2196f3' },
}