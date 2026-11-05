import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { resolveLanguage } from '../i18n/locale';
import type { AppCopy } from '../i18n/strings';
import { stringsFor } from '../i18n/strings';
import type { RegistrationRecord } from '../storage/records';
import { loadRecords } from '../storage/records';

const ADMIN_PASSWORD = '4235';

type Props = {
  onClose: () => void;
};

export function AdminScreen({ onClose }: Props) {
  const language = resolveLanguage();
  const copy = stringsFor(language);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [records, setRecords] = useState<RegistrationRecord[] | null>(null);

  function onUnlock() {
    if (password.trim() !== ADMIN_PASSWORD) {
      setError(copy.wrongPassword);
      setRecords(null);
      return;
    }
    setError('');
    setRecords(loadRecords());
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={copy.back} onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>{copy.back}</Text>
        </Pressable>
        <Text style={styles.title}>{records ? copy.records : copy.admin}</Text>
      </View>
      {records ? (
        <ScrollView contentContainerStyle={styles.list}>
          {records.length === 0 ? (
            <Text style={styles.empty}>{copy.emptyRecords}</Text>
          ) : (
            records.map((record) => (
              <RecordCard key={record.savedAt} record={record} copy={copy} />
            ))
          )}
        </ScrollView>
      ) : (
        <View style={styles.unlock}>
          <Text style={styles.fieldLabel}>{copy.password}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            accessibilityLabel={copy.password}
            testID="admin-password"
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.unlock}
            testID="admin-unlock"
            onPress={onUnlock}
            style={styles.unlockButton}
          >
            <Text style={styles.unlockLabel}>{copy.unlock}</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function RecordCard({ record, copy }: { record: RegistrationRecord; copy: AppCopy }) {
  const gender = record.gender === 'woman' ? copy.woman : copy.man;
  return (
    <View style={styles.card} testID="admin-record">
      <Row label={copy.name} value={record.name} />
      <Row label={copy.age} value={String(record.age)} />
      <Row label={copy.gender} value={gender} />
      <Row label={copy.email} value={record.email} />
      <Row label={copy.ip} value={record.ip} />
      <Row label={copy.savedAt} value={formatSavedAt(record.savedAt)} />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function formatSavedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1C1410',
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    color: '#A89888',
    fontSize: 15,
  },
  title: {
    color: '#E4D5C3',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  unlock: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  fieldLabel: {
    marginBottom: 8,
    color: '#E4D5C3',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#2A211C',
    color: '#F3EBE3',
    fontSize: 17,
  },
  error: {
    marginTop: 12,
    color: '#E7A08A',
    fontSize: 14,
  },
  unlockButton: {
    alignItems: 'center',
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 15,
    backgroundColor: '#E4D5C3',
  },
  unlockLabel: {
    color: '#1C1410',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  empty: {
    marginTop: 24,
    color: '#A89888',
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2A211C',
  },
  row: {
    paddingVertical: 8,
  },
  rowLabel: {
    color: '#A89888',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  rowValue: {
    marginTop: 2,
    color: '#F3EBE3',
    fontSize: 16,
  },
});
