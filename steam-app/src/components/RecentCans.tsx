import { useEffect, useState } from 'react';

type Can = {
  name: string;
  image: string;
  count: number;
};

export default function RecentCansGrid() {
  /**
   * Fetch can count
   */
  const [cans, setCans] = useState<Can[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cans/recent?limit=9')
      .then(res => res.json())
      .then(setCans)
      .catch(err => console.error('Failed to fetch cans:', err));
  }, []);

  /**
   * Setter for can-count
   */
  const updateCanCount = async (name: string, delta: number) => {
    try {
      const res = await fetch('/api/cans/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, delta }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error:', data.error);
        // Optionally show error in UI
      } else {
        console.log(`Updated ${data.updated.name}: ${data.updated.count}`);
        // update local state to render live-changes to can count
        setCans(prevCans =>
          prevCans.map(can =>
            can.name === data.updated.name ? { ...can, count: data.updated.count } : can
          )
        );
      }
    } catch (err) {
      console.error('Request failed', err);
    }
  };


  return (
    <div className="can-collection h-max">
      <div className="backdrop-blur-sm rounded-2xl p-[1.5em]">
        <div className="grid grid-cols-3 gap-5 items-end">
          {cans.map((can, i) => (
            <div
              key={i}
              className=" w-[60px] text-orange-100 rounded p-1 text-center text-xs relative group"
              onMouseEnter={() => setHovered(can.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative inline-block">
                <img
                  src={can.image}
                  className="h-30 object-contain mb-1 block mx-auto"
                />
                <button className="can-count-badge text-[12px] mt-[1em] w-[30px] h-[18px] bg-[#779952] text-black font-bold rounded-full"
                        onClick = {() => updateCanCount(can.name, 1)}>
                  {can.count}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Fixed tooltip beside the grid */}
        {/* <div
          className={`fixed left-[250px] top-[2em] translate-y-1/2 px-3 py-2 bg-black text-white text-[1.5em] rounded shadow transition-opacity z-50 pointer-events-none w-max ${
            hovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          {hovered}
        </div> */}
      </div>
    </div>
  );
}