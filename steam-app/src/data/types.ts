export interface ActivityEntry {
  id: string | number;
  title: string;
  description?: string;
  metricValue?: string | number;
  metricLabel?: string;
  source: 'steam' | 'strava' | 'instagram';
  emoji?: string;
  color?: string;
}