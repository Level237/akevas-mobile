import HeaderScreen from "@/components/common/HeaderScreen";
import ShopDetailFeature from "@/features/shop/components/shopDetail";
import { ShopDetailData } from "@/features/shop/components/shopDetail/types";
import { Stack, useLocalSearchParams } from "expo-router";
import React from 'react';
import { View } from "react-native";

export default function ShopDetail() {
    const { id } = useLocalSearchParams();

    // Mock data for the shop
    const shopData: ShopDetailData = {
        id: id as string,
        name: `Boutique ${id}`,
        city: "Douala-Bonaberi",
        rating: 4.8,
        reviewsCount: 156,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        bannerUrl: require('@/assets/images/shop1.webp'),
        logoUrl: require('@/assets/images/shop1.webp'), // Reuse for mockup
        products: Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            name: `Produit Premium ${i + 1}`,
            price: 15000 + i * 1000,
            imageUrl: require('@/assets/images/shop1.webp'),
        })),
        reviews: [],
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <HeaderScreen title="Détails de la boutique" />
            <ShopDetailFeature shopData={shopData} />
        </View>
    );
}