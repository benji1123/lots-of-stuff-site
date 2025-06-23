import { useEffect, useState } from 'react';

type CanEvent = {
  timestamp: string;
  type: string;
  name: string;
  image: string;
  count: number;
};

export default function RecentCansGrid() {
  const [events, setEvents] = useState<CanEvent[]>([]);

  useEffect(() => {
    fetch('/api/cans/recent?limit=9')
      .then(res => res.json())
      .then(setEvents)
      .catch(err => console.error('Failed to fetch cans:', err));
  }, []);

  return (
    <div className="can-collection w-[200px] h-max">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-[1.5em]">
        {/* <h2 className="text-s text-center text-blue-300 mb-6 font-mono">Cans</h2> */}
        <div className="grid grid-cols-2 gap-5 items-end">
          {events.map((event, i) => (
            <div
              key={i}
              className="text-orange-100 rounded p-1 text-center text-xs"
            >
                <img
                src={event.image}
                className="h-30 object-contain mb-1 block mx-auto"
              />
              <div className="font-small">{event.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}