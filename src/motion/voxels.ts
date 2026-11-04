import { cubeFaces } from './color';

export type Voxel = {
  x: number;
  y: number;
  z: number;
  color: string;
};

export type Face = {
  points: string;
  fill: string;
  depth: number;
};

const UNIT = 22;

function project(x: number, y: number, z: number): { sx: number; sy: number } {
  return {
    sx: (x - z) * UNIT * 0.8660254,
    sy: (x + z) * UNIT * 0.5 - y * UNIT,
  };
}

function face(corners: Array<[number, number, number]>): string {
  return corners
    .map(([x, y, z]) => {
      const point = project(x, y, z);
      return `${point.sx.toFixed(2)},${point.sy.toFixed(2)}`;
    })
    .join(' ');
}

export function voxelFaces(voxels: readonly Voxel[]): Face[] {
  const faces: Face[] = [];
  voxels.forEach((voxel, index) => {
    const { x, y, z, color } = voxel;
    const paint = cubeFaces(color);
    const depth = -z * 100 + y * 10 + x + index * 0.0001;
    const x1 = x + 1;
    const y1 = y + 1;
    const z1 = z + 1;
    faces.push(
      {
        depth: depth + 0.2,
        fill: paint.top,
        points: face([
          [x, y1, z],
          [x1, y1, z],
          [x1, y1, z1],
          [x, y1, z1],
        ]),
      },
      {
        depth,
        fill: paint.left,
        points: face([
          [x, y, z],
          [x1, y, z],
          [x1, y1, z],
          [x, y1, z],
        ]),
      },
      {
        depth: depth + 0.1,
        fill: paint.right,
        points: face([
          [x1, y, z],
          [x1, y, z1],
          [x1, y1, z1],
          [x1, y1, z],
        ]),
      },
    );
  });
  faces.sort((a, b) => a.depth - b.depth);
  return faces;
}
