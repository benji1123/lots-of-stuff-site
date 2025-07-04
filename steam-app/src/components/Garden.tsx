import DigitalPlant from "./Plant";

type Props = {
  numPlants: number;
};

type PlantConfig = {
    id: number | string
    numLeafs: number;
    plantColor: string;
    potColor: string;
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
        numLeafs: 3 + Math.floor(Math.random() * 40),
        plantColor: leafColors[Math.floor(Math.random() * leafColors.length)],
        potColor: leafColors[Math.floor(Math.random() * leafColors.length)]
    })
  }

  return (
    <div className="flex items-end">
      {plantConfigs.map(plant => (
        <DigitalPlant key={plant.id} days={plant.numLeafs} plantColor={plant.plantColor} potColor={plant.potColor} />
      ))}
    </div>
  );
}
