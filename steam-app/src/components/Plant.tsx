import { useEffect, useState } from 'react';

export default function Plant({ days = 5 }: { days: number }) {
  const [leafColor, setLeafColor] = useState('#22c55e');

  useEffect(() => {
    const shades = [
      '#22c55e', '#16a34a', '#4ade80', // greens
      '#3b82f6', '#2563eb', '#60a5fa', // blues
      '#ef4444', '#dc2626', '#f87171'  // reds
    ];
    setLeafColor(shades[Math.floor(Math.random() * shades.length)]);
  }, []);

  const stemX = 50;
  const stemBottomY = 92;
  const stemTopY = stemBottomY - days * 6;

  const stem = (
    <line
      x1={stemX}
      y1={stemBottomY}
      x2={stemX}
      y2={stemTopY}
      stroke="#10b981"
      strokeWidth="2"
    />
  );

  // Generate branches with leaves
  const branches = Array.from({ length: days }, (_, i) => {
  const y = stemBottomY - i * 6 - 4;
  const isLeft = i % 2 === 0;
  const direction = isLeft ? -1 : 1;
  const x1 = stemX;
  const x2 = stemX + direction * 12;
  const y2 = y - 6;

  const controlX = stemX + direction * 6;
  const controlY = y - 2;

  // Thicker branches near the base
  const strokeWidth = 2.5 - i * 0.1;

  return (
    <g key={i}>
      {/* Curved branch using quadratic Bezier path */}
      <path
        d={`M ${x1},${y} Q ${controlX},${controlY} ${x2},${y2}`}
        fill="none"
        stroke="#15803d"
        strokeWidth={strokeWidth}
      />

      {/* Leaf at branch tip */}
      <ellipse
        cx={x2}
        cy={y2}
        rx="3"
        ry="1.5"
        fill={leafColor}
        transform={`rotate(${Math.random() * 30 * direction}, ${x2}, ${y2})`}
      />
    </g>
  );
});

  // Bowl at the base
  const bowl = (
  <g className="bowl-animation">
    {/* Bowl base */}
    <ellipse cx="50" cy="95" rx="16" ry="8" fill="#6B21A8" /> {/* Purple bowl */}

    {/* Rim (on top of soil for depth) */}
    <ellipse cx="50" cy="92" rx="16" ry="4" fill="#9333EA" /> {/* Lighter purple rim */}

    {/* Soil (darker ellipse just under rim) */}
    <ellipse cx="50" cy="92" rx="15" ry="3.5" fill="#3b2f2f" /> {/* Dark soil */}
  </g>
);

  return (
  <svg
      viewBox="0 0 100 110"
      width={100} // or use className="w-[100px]"
      height={110}
      className="mx-auto"
    >
    {/* Bowl rendered first (in the back) */}
    {bowl}
    {/* Plant stem and branches rendered after (on top) */}
    {stem}
    {branches}
  </svg>
);}