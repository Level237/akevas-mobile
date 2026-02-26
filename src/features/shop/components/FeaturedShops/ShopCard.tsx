import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CARD_MARGIN } from './styles';

type Props = {
    id: string;
    name: string;
    image: any;
    isPremium?: boolean;
};

const ShopCard = ({ id, name, image, isPremium }: Props) => {
    const router = useRouter()
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => { router.push({ pathname: "/[id]", params: { id: id } }); }} style={styles.container}>
            <Image
                source={image}
                contentFit="cover"
                transition={500}
                style={styles.image}
            />

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            >
                <Text style={styles.name}>{name}</Text>
            </LinearGradient>

            {isPremium && (
                <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>Premium</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 250,
        borderRadius: 18,
        overflow: 'hidden',
        marginHorizontal: CARD_MARGIN,
        backgroundColor: '#222',
        position: 'relative',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        justifyContent: 'flex-end',
        padding: 20,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    premiumBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#eba900', // Gold/Orange from image
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '700',
    },
});

export default React.memo(ShopCard);
