/**
 * Offline-safe SVG placeholder image (no external URLs) for marketing panels.
 */
const heroImage = (emoji, label) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="640" viewBox="0 0 800 640">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f1e1"/>
      <stop offset="100%" stop-color="#c3e3c6"/>
    </linearGradient>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#295f35"/>
      <stop offset="100%" stop-color="#439352"/>
    </linearGradient>
  </defs>
  <rect width="800" height="640" fill="url(#g)"/>
  <circle cx="620" cy="110" r="150" fill="rgba(255,255,255,0.30)"/>
  <circle cx="180" cy="560" r="200" fill="rgba(255,255,255,0.22)"/>
  <rect x="110" y="120" width="580" height="400" rx="36" fill="url(#h)"/>
  <rect x="140" y="150" width="520" height="130" rx="24" fill="rgba(255,255,255,0.16)"/>
  <text x="400" y="250" font-size="64" text-anchor="middle" font-family="sans-serif" fill="#ffffff" font-weight="bold">${label || "Farm Fresh"}</text>
  <text x="400" y="330" font-size="200" text-anchor="middle">${emoji}</text>
  <circle cx="400" cy="470" r="44" fill="rgba(255,255,255,0.2)"/>
  <text x="400" y="488" font-size="46" text-anchor="middle">🍅</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export default heroImage;