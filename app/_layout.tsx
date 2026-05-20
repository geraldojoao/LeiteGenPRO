import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  RobotoMono_400Regular,
  useFonts as useRobotoMonoFonts,
} from '@expo-google-fonts/roboto-mono';
import { CartShortcut } from '@/components/common/CartShortcut';
import { colors } from '@/constants/theme';
import { useBootstrapCatalog } from '@/hooks/useBootstrapCatalog';

SplashScreen.preventAutoHideAsync();

export default function RootLayout(): JSX.Element | null {
  useBootstrapCatalog();
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_600SemiBold });
  const [monoLoaded] = useRobotoMonoFonts({ RobotoMono_400Regular });
  const fontsLoaded = interLoaded && monoLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.textPrimary },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="checkout"
          options={{
            headerTitle: 'Pagamento Simulado',
            headerBackTitle: 'Voltar',
            headerRight: () => <CartShortcut compact />,
          }}
        />
        <Stack.Screen
          name="touro/[id]"
          options={{
            headerTitle: 'Detalhes do Reprodutor',
            headerBackTitle: 'Voltar',
            headerRight: () => <CartShortcut compact />,
          }}
        />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
