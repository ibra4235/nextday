import { File, Paths } from 'expo-file-system';

import { fetchPublicIp } from '../net/publicIp';

export type Gender = 'woman' | 'man';

export type RegistrationRecord = {
  name: string;
  age: number;
  gender: Gender;
  email: string;
  ip: string;
  savedAt: string;
};

const FILE_NAME = 'registrations.json';

function recordsFile(): File {
  return new File(Paths.document, FILE_NAME);
}

function isGender(value: unknown): value is Gender {
  return value === 'woman' || value === 'man';
}

function isRecord(value: unknown): value is RegistrationRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Partial<RegistrationRecord>;
  return (
    typeof record.name === 'string' &&
    typeof record.age === 'number' &&
    Number.isFinite(record.age) &&
    isGender(record.gender) &&
    typeof record.email === 'string' &&
    typeof record.ip === 'string' &&
    typeof record.savedAt === 'string'
  );
}

export function loadRecords(): RegistrationRecord[] {
  const file = recordsFile();
  if (!file.exists) {
    return [];
  }
  try {
    const parsed = JSON.parse(file.textSync()) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isRecord).reverse();
  } catch {
    return [];
  }
}

export async function saveRegistration(input: {
  name: string;
  age: number;
  gender: Gender;
  email: string;
}): Promise<RegistrationRecord> {
  const ip = await fetchPublicIp();
  const record: RegistrationRecord = {
    name: input.name,
    age: input.age,
    gender: input.gender,
    email: input.email,
    ip,
    savedAt: new Date().toISOString(),
  };
  const stored = loadRecords().slice().reverse();
  stored.push(record);
  const file = recordsFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  await file.write(JSON.stringify(stored));
  return record;
}
