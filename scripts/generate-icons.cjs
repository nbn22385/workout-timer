const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');

async function createIcon(size, filename) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#e94560"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" stroke-width="4"/>
    <line x1="50" y1="50" x2="50" y2="25" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="70" y2="50" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
  
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, filename));
    
  console.log(`Created ${filename}`);
}

async function main() {
  await createIcon(192, 'icon-192.png');
  await createIcon(512, 'icon-512.png');
  console.log('Icons created successfully!');
}

main().catch(console.error);
