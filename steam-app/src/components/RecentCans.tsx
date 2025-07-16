import { useEffect, useState } from 'react';
import ServingDish from './ServingDish';
import { GLASS_COLOR } from '../constants';

type Can = {
  name: string;
  image: string;
  count: number;
};

const CAN_LIMIT = 15;

export default function RecentCansGrid() {
  /**
   * Fetch can count
   */
  const [cans, setCans] = useState<Can[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cans/recent?limit=${CAN_LIMIT}`)
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
      <div className="can-collection w-fit h-max rounded-2xl py-3 px-3">
        <div className="grid grid-cols-3 gap-[2em] md:gap-3 items-end w-fit">
          {cans.map((can, i) =>  Can(can, i))}
        </div>
      </div>
  );

  function Can(can: Can, i: number) {
    return (
      <div
        key={i}
        className="w-[80px] text-orange-100 rounded p-2 text-center opacity-90"
        onMouseEnter={() => setHovered(can.name)}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="relative inline-block">
          <img
            src={can.image}
            className="h-30 object-contain mb-1 block mx-auto"
            onClick = {() => updateCanCount(can.name, 1)}
          />
          <button className="can-count-badge text-[12px] mt-[1em] w-[30px] h-[18px] bg-[#779952] text-black font-bold rounded-full"
                  onClick = {() => updateCanCount(can.name, -1)}>
            {can.count}
          </button>
        </div>
      </div>
    );
  }
}

