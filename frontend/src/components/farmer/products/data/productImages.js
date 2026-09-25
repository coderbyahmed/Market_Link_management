/**
 * Builds a lightweight local SVG placeholder for mock products.
 * Keeping images as data URIs means the module works offline and
 * no external image URL can ever break.
 */
const productImage = (emoji, colorFrom, colorTo) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colorFrom}"/>
      <stop offset="100%" stop-color="${colorTo}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g)"/>
  <circle cx="200" cy="150" r="96" fill="rgba(255,255,255,0.38)"/>
  <text x="200" y="152" font-size="104" text-anchor="middle" dominant-baseline="central">${emoji}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export default productImage;
