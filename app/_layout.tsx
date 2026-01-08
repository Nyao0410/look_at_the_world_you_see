import { Stack } from 'expo-router';
import { Buffer } from 'buffer';
import '../src/i18n/config';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
