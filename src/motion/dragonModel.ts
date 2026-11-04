import { luminance, mix } from './color';
import type { Pose } from './pose';
import type { Voxel } from './voxels';

const MOUTH = '#3A1816';
const MILK = '#FFFFFF';
const BOTTLE = '#F4F8FC';
const CAP = '#7EB6D9';
const FOOD = '#E23D2B';
const LEAF = '#6FA34A';
const DREAM = '#F3EBE3';

type Cube = [number, number, number];

function push(voxels: Voxel[], cubes: Cube[], color: string, shift: Cube = [0, 0, 0]) {
  for (const [x, y, z] of cubes) {
    voxels.push({ x: x + shift[0], y: y + shift[1], z: z + shift[2], color });
  }
}

function bodyCubes(): Cube[] {
  const cubes: Cube[] = [];
  for (let y = 0; y <= 2; y += 1) {
    for (let x = -1; x <= 1; x += 1) {
      for (let z = 0; z <= 2; z += 1) {
        cubes.push([x, y, z]);
      }
    }
  }
  return cubes;
}

function headCubes(): Cube[] {
  const cubes: Cube[] = [];
  for (let y = 0; y <= 2; y += 1) {
    for (let x = -1; x <= 1; x += 1) {
      for (let z = 0; z <= 1; z += 1) {
        cubes.push([x, y, z]);
      }
    }
  }
  return cubes;
}

function add(a: Cube, b: Cube): Cube {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function turn(x: number, y: number, degrees: number): [number, number] {
  const angle = (degrees * Math.PI) / 180;
  const dx = x - 3.4;
  const dy = y - 0.2;
  return [3.4 + dx * Math.cos(angle) - dy * Math.sin(angle), 0.2 + dx * Math.sin(angle) + dy * Math.cos(angle)];
}

export function dragonVoxels(color: string, pose: Pose, phase: number): Voxel[] {
  const voxels: Voxel[] = [];
  const belly = mix(color, '#FFFFFF', 0.5);
  const horn = mix(color, '#000000', 0.55);
  const wing = mix(color, '#FFFFFF', 0.22);
  const foot = mix(color, '#000000', 0.25);
  const eye = luminance(color) < 140 ? '#F7F4EF' : '#1B140F';
  const pupil = '#1B140F';
  const dip: Cube = [0, -pose.headDip * 0.9, -pose.headDip * 0.55];

  for (const [x, y, z] of bodyCubes()) {
    push(voxels, [[x, y, z]], y === 0 && z === 0 ? belly : color);
  }

  const head = add([0, 3, -1], dip);
  push(voxels, headCubes(), color, head);
  push(voxels, [[-1, 1, -1], [0, 1, -1], [1, 1, -1], [0, 1, -2]], belly, head);

  const jawDrop = -pose.mouth * 1.7;
  push(voxels, [[-1, 0, -1], [0, 0, -1], [1, 0, -1], [0, 0, -2]], color, [dip[0], 2.55 + jawDrop + dip[1], dip[2]]);
  push(voxels, [[-0.4, 0, 0], [0.5, 0, 0]], MOUTH, [0, 3.15 + dip[1], -1.7 + dip[2]]);

  push(voxels, [[-1, 2, -1], [1, 2, -1]], eye, head);
  push(voxels, [[-1, 1.75, -1.45], [1, 1.75, -1.45]], pupil, head);
  if (pose.lid > 0.02) {
    push(voxels, [[-1, 0, 0], [1, 0, 0]], color, [dip[0], 5.85 - pose.lid * 1.35 + dip[1], -2.15 + dip[2]]);
  }
  push(
    voxels,
    [
      [-1, 3, 0],
      [-1, 4, 0],
      [-1, 5, 0],
      [1, 3, 0],
      [1, 4, 0],
      [1, 5, 0],
    ],
    horn,
    head,
  );

  const wingLift = pose.wing * 1.1;
  for (const side of [-1, 1]) {
    push(
      voxels,
      [
        [2, 2, 1],
        [3, 2 + wingLift * 0.35, 1],
        [4, 2 + wingLift * 0.7, 1],
        [5, 1.7 + wingLift, 1.2],
        [3, 1.15, 1.5],
        [4, 1.05 + wingLift * 0.4, 1.6],
      ].map(([x, y, z]) => [x * side, y, z] as Cube),
      wing,
    );
  }

  const legs: Array<[number, number]> = [
    [-1, 0],
    [1, 0],
    [-1, 2],
    [1, 2],
  ];
  for (const [x, z] of legs) {
    const lead = (z < 1) === (x < 0);
    const step = lead ? pose.run : -pose.run;
    const lift = Math.max(0, step) * 1.35;
    push(voxels, [[x, -1, z]], color);
    push(voxels, [[x, -2 + lift, z + step * 0.55]], foot);
  }

  push(voxels, [[0, 1, 3], [0, 1.3, 4], [0, 1.8, 5], [0.15, 2.5, 5.8], [0.7, 3.1, 6.2]], color);

  if (pose.showFood) {
    const x = 4.8 + (0.1 - 4.8) * pose.eatT;
    const y = 5.1 + (3.3 - 5.1) * pose.eatT + dip[1];
    const z = 1.1 + (-2.6 - 1.1) * pose.eatT;
    push(voxels, [[0, 0, 0]], FOOD, [x, y, z]);
    push(voxels, [[0, 0.85, 0]], LEAF, [x, y, z]);
  }

  if (pose.showMilk) {
    const tilt = pose.drink * 58;
    const parts: Array<[number, number, number, string]> = [
      [3.4, 0.2, 0.4, BOTTLE],
      [3.4, 1.2, 0.4, BOTTLE],
      [3.4, 2.2, 0.4, BOTTLE],
      [3.4, 3.05, 0.4, CAP],
    ];
    for (const [x, y, z, paint] of parts) {
      const [rx, ry] = turn(x, y, -tilt);
      push(voxels, [[0, 0, 0]], paint, [rx, ry, z]);
    }
    for (let drop = 0; drop < 3; drop += 1) {
      const travel = (phase * 1.7 + drop * 0.28) % 1;
      push(voxels, [[0, 0, 0]], MILK, [2.8 + (0.3 - 2.8) * travel, 3.3 + (2.9 - 3.3) * travel, -1.2]);
    }
  }

  if (pose.sleepZ > 0.05) {
    const rise = pose.sleepZ;
    push(voxels, [[0, 0, 0]], DREAM, [2.6, 7.4 + rise * 1.4, 0.2]);
    push(voxels, [[0, 0, 0]], DREAM, [3.5, 8.6 + rise * 1.6, -0.1]);
    push(voxels, [[0, 0, 0]], DREAM, [4.3, 9.8 + rise * 1.8, 0.2]);
  }

  return voxels;
}
