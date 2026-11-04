import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AdminEntry } from '../components/AdminEntry';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import type { Gender } from '../storage/records';
import { saveRegistration } from '../storage/records';

type Props = {
  onAdmin: () => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegistrationScreen({ onAdmin }: Props) {
  const copy = stringsFor(resolveLanguage());
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSave() {
    if (saving) {
      return;
    }
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const parsedAge = Number(age);
    const ageIsValid = /^\d+$/.test(age) && parsedAge >= 1 && parsedAge <= 120;
    if (!trimmedName || !ageIsValid || !gender || !EMAIL_PATTERN.test(trimmedEmail)) {
      setNotice('');
      setError(copy.missingFields);
      return;
    }

    Keyboard.dismiss();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await saveRegistration({
        name: trimmedName,
        age: parsedAge,
        gender,
        email: trimmedEmail,
      });
      setName('');
      setAge('');
      setGender(null);
      setEmail('');
      setNotice(copy.saved);
    } catch {
      setError(copy.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <StatusBar style="light" />
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Field label={copy.name}>
          <TextInput
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!saving}
            accessibilityLabel={copy.name}
            testID="signup-name"
            style={styles.input}
          />
        </Field>
        <Field label={copy.age}>
          <TextInput
            value={age}
            onChangeText={(value) => setAge(value.replace(/[^\d]/g, ''))}
            keyboardType="number-pad"
            editable={!saving}
            accessibilityLabel={copy.age}
            testID="signup-age"
            style={styles.input}
          />
        </Field>
        <Text style={styles.fieldLabel}>{copy.gender}</Text>
        <View style={styles.genderRow}>
          <GenderChoice
            label={copy.woman}
            testID="signup-gender-woman"
            selected={gender === 'woman'}
            disabled={saving}
            onPress={() => setGender('woman')}
          />
          <GenderChoice
            label={copy.man}
            testID="signup-gender-man"
            selected={gender === 'man'}
            disabled={saving}
            onPress={() => setGender('man')}
          />
        </View>
        <Field label={copy.email}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!saving}
            accessibilityLabel={copy.email}
            testID="signup-email"
            style={styles.input}
          />
        </Field>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {notice ? (
          <Text testID="signup-saved" style={styles.notice}>
            {notice}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saving ? copy.saving : copy.save}
          testID="signup-save"
          disabled={saving}
          onPress={() => {
            void onSave();
          }}
          style={[styles.save, saving && styles.saveDisabled]}
        >
          <Text style={styles.saveLabel}>{saving ? copy.saving : copy.save}</Text>
        </Pressable>
      </ScrollView>
      <AdminEntry onPress={onAdmin} />
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function GenderChoice({
  label,
  testID,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  testID: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={[styles.gender, selected && styles.genderSelected]}
    >
      <Text style={[styles.genderLabel, selected && styles.genderLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1C1410',
  },
  content: {
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  field: {
    marginBottom: 18,
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
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  gender: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#2A211C',
  },
  genderSelected: {
    backgroundColor: '#E4D5C3',
  },
  genderLabel: {
    color: '#E4D5C3',
    fontSize: 16,
  },
  genderLabelSelected: {
    color: '#1C1410',
  },
  error: {
    marginBottom: 12,
    color: '#E7A08A',
    fontSize: 14,
  },
  notice: {
    marginBottom: 12,
    color: '#E4D5C3',
    fontSize: 14,
  },
  save: {
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 15,
    backgroundColor: '#E4D5C3',
  },
  saveDisabled: {
    opacity: 0.6,
  },
  saveLabel: {
    color: '#1C1410',
    fontSize: 16,
    fontWeight: '600',
  },
});
