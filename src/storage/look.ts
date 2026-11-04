import { File, Paths } from 'expo-file-system';

const FILE_NAME = 'look.json';

export type BabyLook = 'pixel' | 'dimensional';

function lookFile(): File {
  return new File(Paths.document, FILE_NAME);
}

export function loadLook(): BabyLook {
  const file = lookFile();
  if (!file.exists) {
    return 'pixel';
  }
  try {
    const parsed = JSON.parse(file.textSync()) as { look?: unknown };
    if (parsed.look === 'pixel' || parsed.look === 'dimensional') {
      return parsed.look;
    }
    return 'pixel';
  } catch {
    return 'pixel';
  }
}

export function saveLook(look: BabyLook): void {
  const file = lookFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.writeSync(JSON.stringify({ look }));
}
