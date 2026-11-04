export function rgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const n = Number.parseInt(value, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function hex(channels: [number, number, number]): string {
  return `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

export function mix(from: string, to: string, amount: number): string {
  const start = rgb(from);
  const end = rgb(to);
  return hex(start.map((channel, index) => channel + (end[index] - channel) * amount) as [number, number, number]);
}

export function luminance(color: string): number {
  const [r, g, b] = rgb(color);
  return (r + g + b) / 3;
}

export function cubeFaces(color: string): { top: string; left: string; right: string } {
  return {
    top: mix(color, '#FFFFFF', 0.34),
    right: mix(color, '#000000', 0.08),
    left: mix(color, '#000000', 0.28),
  };
}
