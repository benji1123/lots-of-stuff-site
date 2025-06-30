import { useEffect, useState } from 'react';
import { ActivityEntry } from '../data/types';
import { mapSteam, mapStrava } from '../data/mappers';

export function useActivityData() {
  const [data, setData] = useState<Record<string, ActivityEntry[]>>({});

  useEffect(() => {
    fetch('/api/activity?days=10')
      .then(res => res.json())
      .then(raw => {
        const mapped: Record<string, ActivityEntry[]> = {};

        for (const date in raw) {
          const entry = raw[date];
          const dayEntries: ActivityEntry[] = [
            ...(entry.steam?.map(mapSteam) || []),
            ...(entry.strava?.map(mapStrava) || []),
            // ...(entry.instagram?.map(mapInstagram) || []),
          ];
          mapped[date] = dayEntries;
        }

        setData(mapped);
      });
  }, []);

  return data;
}