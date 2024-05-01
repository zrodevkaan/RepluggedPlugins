export function hexToRGB(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `RGB(${r}, ${g}, ${b})`;
}

export function hexToCmyk(hex) {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  let k = 1 - Math.max(r, g, b);
  let c = (1 - r - k) / (1 - k);
  let m = (1 - g - k) / (1 - k);
  let y = (1 - b - k) / (1 - k);

  return `CMYK(${c}, ${m}, ${y}, ${k})`;
}

function hexToHsv(hex) {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max;

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * (((b - r) / delta) + 2);
    } else {
      h = 60 * (((r - g) / delta) + 4);
    }
  }

  return `HSV(${h}, ${s}, ${v})`;
}

/**
 * Convert a hex color string to HSL.
 * @param {string} hexColor - The hex color string. e.g #000000
 * @return {array} - The HSL representation
 */
export function hexToHSL(hexColor:string): [number, number, number] {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (hexColor.length == 4) {
    // 3 digits
    r = "0x" + hexColor[1] + hexColor[1];
    g = "0x" + hexColor[2] + hexColor[2];
    b = "0x" + hexColor[3] + hexColor[3];
  } else if (hexColor.length == 7) {
    // 6 digits
    r = "0x" + hexColor[1] + hexColor[2];
    g = "0x" + hexColor[3] + hexColor[4];
    b = "0x" + hexColor[5] + hexColor[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
    cmax = Math.max(r,g,b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0)
    h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return `HSL(${h}, ${s}, ${l})`;
}
