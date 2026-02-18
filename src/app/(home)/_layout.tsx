import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShoppingBag, ShoppingCart, Store } from "lucide-react-native";
import React from 'react';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

            <StatusBar style="auto" />

            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: COLORS.primary,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: { height: 60, paddingBottom: 10 }, // Petit conseil pour aérer le bas
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Accueil',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="shop"
                    options={{
                        title: 'Boutiques',
                        // "bag.fill" ou "storefront.fill" sont les standards pour les boutiques
                        tabBarIcon: ({ color }) => <Store color={color} style={{ width: 28, height: 28 }} />,
                    }}
                />
                <Tabs.Screen
                    name="product"
                    options={{
                        title: 'Produits',
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
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
                    }}
                />
            </Tabs>
        </ThemeProvider>

    );
}
