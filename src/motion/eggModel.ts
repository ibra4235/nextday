import type { Pose } from './pose';
import type { Voxel } from './voxels';

const SHELL = '#5E8C46';
const SHELL_LIGHT = '#7AAA58';
const BELLY = '#E0B34A';
const EYE = '#F7F4EF';
const PUPIL = '#1B140F';
const MOUTH = '#2A1412';
const FOOT = '#3E5C32';
const FOOD = '#E23D2B';
const LEAF = '#3E9A32';
const BOTTLE = '#F4F8FC';
const CAP = '#7EB6D9';
const MILK = '#FFFFFF';
const DREAM = '#F3EBE3';

const RADII = [1.15, 1.85, 2.25, 2.35, 2.15, 1.7, 1.15, 0.55];

function disk(radius: number): Array<[number, number]> {
  const cells: Array<[number, number]> = [];
  const limit = Math.ceil(radius);
  for (let x = -limit; x <= limit; x += 1) {
    for (let z = -limit; z <= limit; z += 1) {
      if (x * x + z * z <= radius * radius + 0.35) {
        cells.push([x, z]);
      }
    }
  }
  return cells;
}

function turn(x: number, y: number, pivotX: number, pivotY: number, degrees: number): [number, number] {
  const angle = (degrees * Math.PI) / 180;
  const dx = x - pivotX;
  const dy = y - pivotY;
  return [pivotX + dx * Math.cos(angle) - dy * Math.sin(angle), pivotY + dx * Math.sin(angle) + dy * Math.cos(angle)];
}

export function eggVoxels(pose: Pose, phase: number): Voxel[] {
  const voxels: Voxel[] = [];
  RADII.forEach((radius, y) => {
    disk(radius).forEach(([x, z]) => {
      const jawSlot = y === 2 && z <= -1 && Math.abs(x) <= 1;
      if (jawSlot) {
        return;
      }
      const belly = y >= 1 && y <= 3 && z < 0 && Math.abs(x) <= 1;
      const shell = (x + y + z) % 2 === 0 ? SHELL_LIGHT : SHELL;
      voxels.push({ x, y, z, color: belly ? BELLY : shell });
    });
  });

  voxels.push({ x: -0.55, y: 1.7, z: -1.7, color: MOUTH }, { x: 0.45, y: 1.7, z: -1.7, color: MOUTH });
  const jawY = 1.15 - pose.mouth * 2.3;
  for (const x of [-1, 0, 1]) {
    voxels.push({ x, y: jawY, z: -2.15, color: BELLY });
  }

  for (const x of [-1.15, 1.15]) {
    voxels.push({ x, y: 4.55, z: -2.25, color: EYE });
    voxels.push({ x: x + (x < 0 ? 0.18 : -0.18), y: 4.35, z: -2.7, color: PUPIL });
  }

  const stride = pose.run;
  voxels.push({ x: -1.15, y: -1 + Math.max(0, stride) * 1.35, z: -stride * 0.45, color: FOOT });
  voxels.push({ x: 1.15, y: -1 + Math.max(0, -stride) * 1.35, z: stride * 0.45, color: FOOT });

  if (pose.lid > 0.02) {
    for (const x of [-1.15, 1.15]) {
      voxels.push({ x, y: 5.7 - pose.lid * 1.45, z: -2.35, color: SHELL });
    }
  }

  if (pose.showFood) {
    const x = 4.4 + (0.2 - 4.4) * pose.eatT;
    const y = 3.6 + (2.15 - 3.6) * pose.eatT;
    const z = 0.4 + (-2.3 - 0.4) * pose.eatT;
    voxels.push({ x, y, z, color: FOOD }, { x: x + 0.15, y: y + 0.95, z, color: LEAF });
  }

  if (pose.showMilk) {
    const tilt = pose.drink * 62;
    const parts: Array<[number, number, number, string]> = [
      [3.35, 0.1, 0.1, BOTTLE],
      [3.35, 1.1, 0.1, BOTTLE],
      [3.35, 2.1, 0.1, BOTTLE],
      [3.35, 2.95, 0.1, CAP],
    ];
    for (const [x, y, z, color] of parts) {
      const [rx, ry] = turn(x, y, 3.35, 0.1, -tilt);
      voxels.push({ x: rx, y: ry, z, color });
    }
    for (let drop = 0; drop < 5; drop += 1) {
      const travel = (phase * 1.4 + drop * 0.18) % 1;
      voxels.push({
        x: 2.8 + (0.15 - 2.8) * travel,
        y: 3.1 + (2.05 - 3.1) * travel,
        z: -2.2,
        color: MILK,
      });
    }
  }

  if (pose.sleepZ > 0.05) {
    const rise = pose.sleepZ;
    voxels.push({ x: 2.4, y: 7.2 + rise * 1.6, z: 0.2, color: DREAM });
    voxels.push({ x: 3.35, y: 8.5 + rise * 1.8, z: -0.2, color: DREAM });
    voxels.push({ x: 4.15, y: 9.7 + rise * 2, z: 0.15, color: DREAM });
  }

  return voxels;
}
