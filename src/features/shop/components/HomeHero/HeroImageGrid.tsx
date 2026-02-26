import { useGetProfileShopQuery } from '@/services/guardService';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';


// These could be passed as props, but using placeholders for now as per constraints
const HeroImageGrid = () => {
    const { data: shops, isLoading } = useGetProfileShopQuery("guard");
    console.log(shops);
    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {!isLoading && shops?.length > 0 && (
                    <>
                        <View style={styles.row}>
                            <View style={styles.imageBox} >
                                <Image transition={500} contentFit="cover" source={shops[0].shop_profile} style={styles.image} />
                            </View>
                            <View style={styles.imageBox} >
                                <Image contentFit="cover"
                                    transition={500} source={shops[1].shop_profile} style={styles.image} />
                            </View>

                        </View>
                        <View style={styles.row}>
                            <View style={styles.imageBox} >
                                <Image transition={500} contentFit="cover" source={shops[2].shop_profile} style={styles.image} />
                            </View>
                            <View style={styles.imageBox} >
                                <Image contentFit="cover"
                                    transition={500} source={shops[3].shop_profile} style={styles.image} />
                            </View>

                        </View>
                    </>
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    grid: {
        width: '90%', // Use more width
        gap: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    imageBox: {
        flex: 1,
        aspectRatio: 1.4,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
});

export default HeroImageGrid;
