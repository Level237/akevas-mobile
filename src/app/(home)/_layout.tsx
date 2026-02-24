import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShoppingBag, ShoppingCart, Store, User } from "lucide-react-native";
import React from 'react';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

            <StatusBar style="dark" />

            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarButton: HapticTab,
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF', // 👈 C'est ici que tu changes le background
                        borderTopWidth: 0,           // Pour enlever le trait gris du haut
                        elevation: 10,               // Ombre sur Android
                        shadowColor: '#000',         // Ombre sur iOS
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        height: 60,                  // Un peu plus haut pour le confort
                        paddingBottom: 10,           // Aligne bien les icônes
                    }, // Petit conseil pour aérer le bas
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        title: 'Accueil',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="shop"
                    options={{
                        title: 'Boutiques',
                        headerShown: false,
                        // "bag.fill" ou "storefront.fill" sont les standards pour les boutiques
                        tabBarIcon: ({ color }) => <Store color={color} style={{ width: 28, height: 28 }} />,
                    }}
                />
                <Tabs.Screen
                    name="product"
                    options={{
                        title: 'Produits',
                        headerShown: false,
                        // "square.grid.2x2.fill" évoque bien un catalogue de produits
                        tabBarIcon: ({ color }) => <ShoppingBag color={color} style={{ width: 28, height: 28 }} />,
                    }}
                />
                <Tabs.Screen
                    name="cart"
                    options={{
                        title: 'Panier',
                        // "cart.fill" est indispensable ici
                        tabBarIcon: ({ color }) => <ShoppingCart color={color} style={{ width: 28, height: 28 }} />,
                    }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: 'Compte',
                        // "person.fill" pour l'espace utilisateur
                        tabBarIcon: ({ color }) => <User color={color} style={{ width: 28, height: 28 }} />,
                    }}
                />
            </Tabs>
        </ThemeProvider>

    );
}
