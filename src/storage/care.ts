import { File, Paths } from 'expo-file-system';

export type CareKind = 'food' | 'milk' | 'sleep' | 'training' | 'talk';

export type CareRecord = {
  kind: CareKind;
  savedAt: string;
};

const FILE_NAME = 'cares.json';
const KINDS: readonly CareKind[] = ['food', 'milk', 'sleep', 'training', 'talk'];

function caresFile(): File {
  return new File(Paths.document, FILE_NAME);
}

function isKind(value: unknown): value is CareKind {
  return typeof value === 'string' && KINDS.includes(value as CareKind);
}

function isCare(value: unknown): value is CareRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Partial<CareRecord>;
  return isKind(record.kind) && typeof record.savedAt === 'string';
}

export function loadCares(): CareRecord[] {
  const file = caresFile();
  if (!file.exists) {
    return [];
  }
  try {
    const parsed = JSON.parse(file.textSync()) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isCare);
  } catch {
    return [];
  }
}

export async function saveCare(kind: CareKind): Promise<CareRecord> {
  const record: CareRecord = {
    kind,
    savedAt: new Date().toISOString(),
  };
  const stored = [...loadCares(), record];
  const file = caresFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  await file.write(JSON.stringify(stored));
  return record;
}
