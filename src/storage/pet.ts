import { File, Paths } from 'expo-file-system';

import { characterById } from '../characters/catalog';

const FILE_NAME = 'pet.json';

function petFile(): File {
  return new File(Paths.document, FILE_NAME);
}

export function loadPetId(): string | null {
  const file = petFile();
  if (!file.exists) {
    return null;
  }
  try {
    const parsed = JSON.parse(file.textSync()) as { id?: unknown };
    if (typeof parsed.id !== 'string' || !characterById(parsed.id)) {
      return null;
    }
    return parsed.id;
  } catch {
    return null;
  }
}

export function savePetId(id: string): void {
  if (!characterById(id)) {
    return;
  }
  const file = petFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.writeSync(JSON.stringify({ id }));
}
