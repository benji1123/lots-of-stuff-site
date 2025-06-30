/**
 * @file mappers.ts
 * @description This file contains functions to map raw activity data from different sources (Steam, Strava)
 * to a standardized {@link ActivityEntry} format that is rendered by {@link ActivityBubble}.
 */

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
    metric: `${entry.minutes_played_today}min`,
    description: `${getFlooredLocaleString(entry.minutes_played_total)}min`,
    source: 'steam',
    color: '#0c151a',
    emoji: '🀄',
    url: `https://store.steampowered.com/app/${entry.appid}`,
    gamePosterUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${entry.appid}/header.jpg`,
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
  if (entry.type === 'Workout') {
    entry['type'] = 'Boxing'; // convert Workout to Boxing
  }
  const metricValue = entry.metricValue > 0 ? entry.metricValue : entry.time
  const metricLabel = entry.metricValue > 0 ? "km" : "min"
  const activityConfig = STRAVA_ACTIVITY_CONFIG_MAP[entry.type.toLowerCase()];
  return {
    id: entry.id,
    title: entry.title,
    metric: `${metricValue}${metricLabel} ${entry.type.toLowerCase()}`,
    source: 'strava',
    color: '#0c151a',
    emoji: activityConfig?.emoji || '🏋️',
    url: `https://www.strava.com/activities/${entry.id}`,
    description: `${getRolledUpStatString(entry.activityTotal)}`
  };
}

/**
 * return a string that summarizes a Strava (@type ActivityTotal)
 * https://developers.strava.com/docs/reference/#api-models-ActivityTotal
 */
const getRolledUpStatString = (activityTotal: any): string => {
  if (activityTotal == undefined) {
    return "";
  }
  const stats: String[] = [];
  if (activityTotal.distance) {
    stats.push(`${getFlooredLocaleString(activityTotal.distance, 1000)}km`)
  }
  if (activityTotal.elapsed_time) {
    stats.push(`${getFlooredLocaleString(activityTotal.elapsed_time, 60)}min`)
  }
  // if (activityTotal.count) {
  //   stats.push(`${activityTotal.count}-activities`)
  // }
  return stats.join(' ');
}

// strava types defined in https://developers.strava.com/docs/reference/#api-models-SportType
const STRAVA_ACTIVITY_CONFIG_MAP: Record<string, any> = {
  'boxing': { emoji: '🥊' },
  'run': { emoji: '👟' },
  'ride': { emoji: '🚲' },
  'swim': { emoji: '🏊' },
  'hike': { emoji: '🥾' },
  'walk': { emoji: '👟' },
  'gym': { emoji: '🏋️' },
  'canoeing': { emoji: '🛶' },
  'kayaking': { emoji: '🛶' },
}

const getFlooredLocaleString = (num: number, divisor: number=1) => Math.floor(num / divisor).toLocaleString()