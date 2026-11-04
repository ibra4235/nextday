import { useCallback, useState } from 'react';

import type { AppLanguage } from './src/i18n/language';
import { CharactersScreen } from './src/screens/CharactersScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LanguageScreen } from './src/screens/LanguageScreen';
import { OpeningScreen } from './src/screens/OpeningScreen';
import { RegistrationScreen } from './src/screens/RegistrationScreen';
import { loadSavedLanguage, saveLanguage } from './src/storage/language';
import { loadRecords } from './src/storage/records';

type Screen = 'opening' | 'language' | 'registration' | 'home' | 'admin' | 'characters';
type Place = 'opening' | 'language' | 'registration' | 'home' | 'characters';

function hasProfile(): boolean {
  return loadRecords().length > 0;
}

function initialScreen(): Screen {
  if (hasProfile()) {
    return 'home';
  }
  if (loadSavedLanguage()) {
    return 'registration';
  }
  return 'opening';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [returnTo, setReturnTo] = useState<Place>(() => (hasProfile() ? 'home' : 'opening'));
  const showHome = useCallback(() => setScreen('home'), []);
  const afterOpening = useCallback(() => {
    if (hasProfile()) {
      setScreen('home');
      return;
    }
    setScreen(loadSavedLanguage() ? 'registration' : 'language');
  }, []);
  const chooseLanguage = useCallback((language: AppLanguage) => {
    saveLanguage(language);
    setScreen(hasProfile() ? 'home' : 'registration');
  }, []);
  const openAdmin = useCallback((from: Place) => {
    setReturnTo(from);
    setScreen('admin');
  }, []);
  const openCharacters = useCallback(() => {
    setReturnTo('home');
    setScreen('characters');
  }, []);
  const closeOverlay = useCallback(() => {
    setScreen(returnTo);
  }, [returnTo]);

  if (screen === 'opening') {
    return <OpeningScreen onFinished={afterOpening} onAdmin={() => openAdmin('opening')} />;
  }
  if (screen === 'language') {
    return <LanguageScreen onChoose={chooseLanguage} />;
  }
  if (screen === 'home') {
    return <HomeScreen onAdmin={() => openAdmin('home')} onCharacters={openCharacters} />;
  }
  if (screen === 'admin') {
    return <AdminScreen onClose={closeOverlay} />;
  }
  if (screen === 'characters') {
    return <CharactersScreen onClose={closeOverlay} />;
  }
  return <RegistrationScreen onAdmin={() => openAdmin('registration')} onSaved={showHome} />;
}
