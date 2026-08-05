import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function NavigationLayout() {
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
                    name="login"
                    options={{
                        title: 'Connexion',

                    }}
                />
                <Stack.Screen
                    name="link-google-phone"
                    options={{
                        title: 'Compléter le profil',

                    }}
                />
            </Stack>
            <StatusBar style="dark" />
        </ThemeProvider>
    );
}