import { useEffect, useState } from 'react';

type Can = {
  name: string;
  image: string;
  count: number;
};

export default function RecentCansGrid() {
  const [cans, setCans] = useState<Can[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cans/recent?limit=9')
      .then(res => res.json())
      .then(setCans)
      .catch(err => console.error('Failed to fetch cans:', err));
  }, []);

  return (
    <div className="can-collection w-[200px] h-max relative">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-[1.5em]">
        <div className="grid grid-cols-2 gap-5 items-end">
          {cans.map((can, i) => (
            <div
              key={i}
              className="text-orange-100 rounded p-1 text-center text-xs relative group"
              onMouseEnter={() => setHovered(can.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative inline-block">
                <img
                  src={can.image}
                  className="h-30 object-contain mb-1 block mx-auto"
                />
                <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[1em] px-2 py-[2px] rounded-full shadow">
                  {can.count}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Fixed tooltip beside the grid */}
        <div
          className={`fixed left-[250px] top-[2em] translate-y-1/2 px-3 py-2 bg-black text-white text-[1.5em] rounded shadow transition-opacity z-50 pointer-events-none w-max ${
            hovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          {hovered}
        </div>
      </div>
    </div>
  );
}