import { useGetProfileShopQuery } from '@/services/guardService';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import HeroSkeleton from './HeroSkeleton';


// These could be passed as props, but using placeholders for now as per constraints
const HeroImageGrid = () => {
    const { data: shops, isLoading } = useGetProfileShopQuery("guard");

    const router = useRouter();

    return (
        <View style={styles.container}>
            {isLoading ? (
                <HeroSkeleton />
            ) : (
                <View style={styles.grid}>
                    {shops?.length > 0 && (
                        <>
                            <View style={styles.row}>
                                <Pressable onPress={() => { router.push({ pathname: "/(shop)/[id]", params: { id: shops[0].id } }); }} style={styles.imageBox} >
                                    <Image transition={500} contentFit="cover" source={shops[0].shop_profile} style={styles.image} />
                                </Pressable>
                                <Pressable onPress={() => { router.push({ pathname: "/(shop)/[id]", params: { id: shops[1].id } }); }} style={styles.imageBox} >
                                    <Image contentFit="cover"
                                        transition={500} source={shops[1].shop_profile} style={styles.image} />
                                </Pressable>

                            </View>
                            <View style={styles.row}>
                                <Pressable onPress={() => { router.push({ pathname: "/(shop)/[id]", params: { id: shops[2].id } }); }} style={styles.imageBox} >
                                    <Image transition={500} contentFit="cover" source={shops[2].shop_profile} style={styles.image} />
                                </Pressable>
                                <Pressable onPress={() => { router.push({ pathname: "/(shop)/[id]", params: { id: shops[3].id } }); }} style={styles.imageBox} >
                                    <Image contentFit="cover"
                                        transition={500} source={shops[3].shop_profile} style={styles.image} />
                                </Pressable>

                            </View>
                        </>
                    )}
                </View>
            )}
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

export default React.memo(HeroImageGrid);
