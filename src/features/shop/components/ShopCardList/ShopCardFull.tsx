import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles, THEME } from './style';
import { ShopCardProps } from './types';

const ShopCardFull = ({ shop, onPress, isPriority = false }: ShopCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress?.(shop)}
            style={styles.fullContainer}
        >
            {/* Banner Section */}
            <View style={{ position: 'relative' }}>
                <Image
                    source={shop.bannerUrl}
                    style={styles.fullBanner}
                    contentFit="cover"
                    transition={200}
                    priority={isPriority ? 'high' : 'normal'}
                />
                <View style={styles.fullBannerOverlay} />

                {/* Overlapping Logo */}
                {shop.logoUrl && (
                    <View style={styles.fullLogoContainer}>
                        <Image
                            source={shop.logoUrl}
                            style={styles.fullLogo}
                            contentFit="cover"
                        />
                    </View>
                )}
            </View>

            {/* Details Section */}
            <View style={styles.fullDetails}>
                <View style={styles.fullHeader}>
                    <Text style={styles.fullTitle} numberOfLines={1}>
                        {shop.name}
                    </Text>
                    {shop.isPremium && (
                        <View style={{ backgroundColor: THEME.primary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>PREMIUM</Text>
                        </View>
                    )}
                </View>

                {shop.description && (
                    <Text style={styles.fullDescription} numberOfLines={2}>
                        {shop.description}
                    </Text>
                )}

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.fullButton}
                    onPress={() => onPress?.(shop)}
                >
                    <Text style={styles.fullButtonText}>Découvrir la boutique</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default memo(ShopCardFull);
