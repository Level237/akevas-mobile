import { Shop } from "@/types/seller";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type SuggestedShopItemProps = {
    shop: Shop;
    color?: string;
    onPress: () => void;
};

const SuggestedShopItem = React.memo(({ shop, onPress, color }: SuggestedShopItemProps) => {
    return (
        <TouchableOpacity
            style={styles.storyItem}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.storyImageContainer}>
                <Image
                    source={shop.shop_profile}
                    style={styles.storyImage}
                    contentFit="cover"
                    transition={200}
                />
            </View>
            <Text style={[styles.storyText, { color }]} numberOfLines={1}>
                {shop.shop_name}
            </Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    storyItem: {
        width: 70,
        marginRight: 16,
        alignItems: 'center',
    },
    storyImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#E67E22',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    storyText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default SuggestedShopItem;
