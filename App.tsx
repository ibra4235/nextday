import { useCallback, useState } from 'react';

import { AdminScreen } from './src/screens/AdminScreen';
import { OpeningScreen } from './src/screens/OpeningScreen';
import { RegistrationScreen } from './src/screens/RegistrationScreen';

type Screen = 'opening' | 'registration' | 'admin';

export default function App() {
  const [screen, setScreen] = useState<Screen>('opening');
  const showRegistration = useCallback(() => setScreen('registration'), []);
  const showAdmin = useCallback(() => setScreen('admin'), []);

  if (screen === 'opening') {
    return <OpeningScreen onFinished={showRegistration} onAdmin={showAdmin} />;
  }
  if (screen === 'admin') {
    return <AdminScreen onClose={showRegistration} />;
  }
  return <RegistrationScreen onAdmin={showAdmin} />;
}
