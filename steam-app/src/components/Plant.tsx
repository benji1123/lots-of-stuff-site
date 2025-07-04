import { useEffect, useState } from "react";

type Props = {
  days: number;
  potColor: string;
  plantColor: string;
};

export default function DigitalPlant({ days, potColor, plantColor }: Props) {
  const [daysElapsed, setDaysElapsed] = useState(days);

  //   useEffect(() => {
  //     async function fetchStartDate() {
  //       const res = await fetch('/api/plant');
  //       const data = await res.json();

  //       const start = new Date(data.startDate);
  //       const today = new Date();
  //       const days = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  //       setDaysElapsed(days);
  //     }

  //     fetchStartDate();
  //   }, []);

  // Map days to number of leaves (1 leaf per 2 days, max 8 leaves)
  const leafCount = Math.min(Math.floor(daysElapsed / 2), 16);

  // Define stem top and bottom Y-coordinates based on number of leaves
  const stemBottomY = 90;
  const stemTopY = 100 - 20 - leafCount * 5;

  // Generate leaf elements (alternating left/right, spaced evenly)
  const leaves = Array.from({ length: leafCount }, (_, i) => {
  const y = stemBottomY - i * 5;
  const isLeft = i % 2 === 0;
  const x = isLeft ? 45 : 55;

  // Random angle between -45 and -15 for left, 15 to 45 for right
  const angle = isLeft
    ? -Math.floor(Math.random() * 45) // 0 to -45
    : Math.floor(Math.random() * 45); // 0 to 45

  return (
    <ellipse
      key={i}
      cx={x}
      cy={y}
      rx="4"
      ry="2"
      fill={plantColor}
      transform={`rotate(${angle}, ${x}, ${y})`}
    />
  );
});

  return (
    <div className="w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Stem */}
        <line
          x1="50"
          y1={stemBottomY}
          x2="50"
          y2={stemTopY}
          stroke={'#16a34a'}
          strokeWidth="4"
        />

        {/* Leaves */}
        {leaves}

        {/* Soil */}
        <g>
          {/* Bowl base (darker, back layer) */}
          <ellipse cx="50" cy="95" rx="16" ry="8" fill="#99433B" />

          {/* Bowl rim (lighter, front layer) */}
          <ellipse cx="50" cy="92" rx="16" ry="4" fill="#E2725B" />
        </g>
        {/* <rect x="30" y="90" width="40" height="10" fill={potColor} /> */}
      </svg>
    </div>
  );
}
