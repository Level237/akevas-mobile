import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Star } from 'lucide-react-native';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ShopDetailData } from './types';

type Props = {
    shop: ShopDetailData;
};

const ShopDetailHeader = ({ shop }: any) => {

    console.log(shop.images?.[0]?.path)
    console.log("mrt")
    return (
        <View style={styles.container}>

            <ImageBackground
                source={{ uri: shop.images?.[0]?.path }}
                style={styles.banner}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{shop.shop_key}</Text>

                        <View style={styles.row}>
                            <MapPin size={14} color="#FFF" />
                            <Text style={styles.location}>{shop.town} - {shop.quarter}</Text>
                        </View>

                        <View style={styles.row}>
                            <Star size={14} color="#E67E22" fill="#E67E22" />
                            <Text style={styles.rating}>
                                {shop.review_average} ({shop.reviewCount} avis)
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Overlapping Logo */}
                <View style={styles.logoContainer}>
                    <Image source={{ uri: shop.shop_profile }} style={styles.logo} />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFF',
    },
    banner: {
        width: '100%',
        height: 250,
        justifyContent: 'flex-end',
    },
    gradient: {
        height: '60%',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    infoContainer: {
        marginLeft: 100, // Make room for the logo
    },
    name: {
        color: '#FFF',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    location: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
    },
    rating: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
    },
    logoContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#FFF',
        padding: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 10,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
});

export default ShopDetailHeader;
