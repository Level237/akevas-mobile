import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight, MapPin, Star } from 'lucide-react-native';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles, THEME } from './style';
import { ShopCardProps } from './types';

const ShopCardCompact = ({ shop, onPress, isPriority = false }: ShopCardProps) => {

    const handlePress = (shopId: any) => {
        // Si ton fichier est app/(shop)/[id].tsx
        router.push({
            pathname: "/[id]", // Le nom du fichier entre crochets
            params: { id: shopId } // L'ID dynamique (ex: 1)
        });
    }
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePress(shop.shop_id)}
            style={styles.compactContainer}
        >
            {/* Image Section */}
            <Image
                source={shop.shop_profile}
                style={styles.compactImage}
                contentFit="cover"
                transition={200}
                priority={isPriority ? 'high' : 'normal'}
            />

            {/* Content Section */}
            <View style={styles.compactContent}>
                <View>
                    <View style={styles.compactHeader}>
                        <Text style={styles.compactTitle} numberOfLines={1}>
                            {shop.shop_name}
                        </Text>
                        {/* 
                        // To re-enable when isPremium is available in API
                        {shop.isPremium && (
                            <View style={{ backgroundColor: THEME.primary, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 }}>
                                <Text style={{ color: '#FFF', fontSize: 8, fontWeight: 'bold' }}>PREMIUM</Text>
                            </View>
                        )} 
                        */}
                    </View>

                    <View style={styles.compactRatingRow}>
                        <Star size={14} color={THEME.star} fill={THEME.star} />
                        <Text style={styles.compactRatingText}>
                            {shop.review_average || 0} ({shop.reviewCount || 0} avis)
                        </Text>
                    </View>

                    <View style={styles.compactLocationRow}>
                        <MapPin size={12} color={THEME.textSecondary} />
                        <Text style={styles.compactLocationText}>{shop.town}</Text>
                    </View>
                </View>

                <View style={styles.compactFooter}>
                    <View style={styles.compactTagsRow}>
                        {shop.categories?.slice(0, 2).map((cat: any, index: number) => (
                            <View key={index} style={styles.tagChip}>
                                <Text style={styles.tagText}>{cat.category_name || cat.name}</Text>
                            </View>
                        ))}
                    </View>

                    <ChevronRight size={20} color={THEME.primary} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default memo(ShopCardCompact);
