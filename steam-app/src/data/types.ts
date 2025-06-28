export interface ActivityEntry {
  id: string | number;
  title: string;
  description?: string;
  metric?: string;
  source: 'steam' | 'strava' | 'instagram';
  emoji?: string;
  color?: string;
  [key: string]: any; 
}