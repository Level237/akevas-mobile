import HeaderScreen from "@/components/common/HeaderScreen";
import ShopDetailFeature from "@/features/shop/components/shopDetail";
import { useGetShopQuery } from "@/services/guardService";
import { Stack, useLocalSearchParams } from "expo-router";
import React from 'react';
import { View } from "react-native";

export default function ShopDetailScreen() {
    const { id } = useLocalSearchParams();
    const { data: { data: shop } = {}, isLoading, error } = useGetShopQuery(id);

    const shopPreview = shop?.shop || {}



    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <HeaderScreen title={shopPreview?.shop_key || ""} />
            <ShopDetailFeature shopData={shopPreview} />
        </View>
    );
}