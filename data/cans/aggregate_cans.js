const fs = require('fs');
const path = require('path');

// Read the cans.json file
const cansPath = path.join(__dirname, 'cans.json');
const cansData = JSON.parse(fs.readFileSync(cansPath, 'utf-8'));

// Aggregate counts by can name
const counts = {};
for (const event of cansData.events) {
  if (!counts[event.name]) {
    counts[event.name] = 0;
  }
  counts[event.name] += event.count || 1;
}

// Write the result to a new file
const outputPath = path.join(__dirname, 'can_counts.json');
fs.writeFileSync(outputPath, JSON.stringify(counts, null, 2));

console.log('Aggregated can counts written to can_counts.json');