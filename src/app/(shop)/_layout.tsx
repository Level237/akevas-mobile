import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ShopLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                headerTintColor: '#E67E22',
                headerBackTitle: 'Retour',
            }}>
                <Stack.Screen
                    name="[id]"
                    options={{
                        title: 'Détail Boutique',
                    }}
                />

            </Stack>
            <StatusBar style="dark" />
        </ThemeProvider>
    );
}