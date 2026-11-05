import { File, Paths } from 'expo-file-system';

const FILE_NAME = 'cracks.json';

function cracksFile(): File {
  return new File(Paths.document, FILE_NAME);
}

export function loadCracks(): number {
  const file = cracksFile();
  if (!file.exists) {
    return 0;
  }
  try {
    const parsed = JSON.parse(file.textSync()) as { count?: unknown };
    if (typeof parsed.count !== 'number' || !Number.isFinite(parsed.count) || parsed.count < 0) {
      return 0;
    }
    return Math.floor(parsed.count);
  } catch {
    return 0;
  }
}

export function addCrack(): number {
  const count = loadCracks() + 1;
  const file = cracksFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.writeSync(JSON.stringify({ count }));
  return count;
}
