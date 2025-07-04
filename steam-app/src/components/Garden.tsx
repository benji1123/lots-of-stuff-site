import DigitalPlant from "./Plant";

type Props = {
  numPlants: number;
};

type PlantConfig = {
    id: number | string
    numLeafs: number;
    offset: number;
}
export default function Garden({ numPlants }: Props) {
  const leafColors = [
    "#22c55e",
    "#16a34a",
    "#4ade80", // greens
    "#3b82f6",
    "#2563eb",
    "#60a5fa", // blues
    "#ef4444",
    "#dc2626",
    "#f87171", // reds
  ];

  const plantConfigs: PlantConfig[] = []
  for (let i=0; i<numPlants; i++) {
    plantConfigs.push({
        id: i,
        numLeafs: 3 + Math.floor(Math.random() * 10),
        offset: 0 // Math.floor(Math.random() * 300) - 10
    })
  }

  return (
    <div className="flex items-end gap-0">
      {plantConfigs.map(plant => (
        <div style={{ margin: `0 0 0 ${plant.offset}px` }}>
          <DigitalPlant key={plant.id} days={plant.numLeafs} />
        </div>
      ))}
    </div>
  );
}
