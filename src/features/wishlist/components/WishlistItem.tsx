import { FavoriteItem } from '@/store/FavoriteSlice';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Props = {
    item: FavoriteItem;
    onRemove: (item: FavoriteItem) => void;
    onAddToCart: (item: FavoriteItem) => void;
    onPress?: (item: FavoriteItem) => void;
};

const WishlistItem = ({ item, onRemove, onAddToCart, onPress }: Props) => {
    const product = item.product || item;
    const selectedVariation = item.selectedVariation;
    const price = selectedVariation?.attributes?.price || selectedVariation?.price || product.product_price;
    const profileImage = selectedVariation?.image || product.product_profile;
    const imageSource = typeof profileImage === 'string' ? { uri: profileImage } : profileImage;


    const swatches = useMemo(() => {
        if (selectedVariation?.color?.hex) {
            return [{ name: selectedVariation.color.name, hex: selectedVariation.color.hex }];
        }
        if (!product.variations?.length) return [];
        const seen = new Set();
        const colors = [];
        for (const variation of product.variations) {
            if (variation.color?.hex && !seen.has(variation.color.hex)) {
                colors.push({
                    name: variation.color.name,
                    hex: variation.color.hex,
                });
                seen.add(variation.color.hex);
            }
            if (colors.length === 4) break;
        }
        return colors;
    }, [product.variations, selectedVariation]);

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => onPress?.(item)}
        >
            {/* Product Image - Portrait 3:4 */}
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />

                {/* Favorite Icon (Filled Orange, No circle) */}
                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => onRemove(item)}
                    activeOpacity={0.6}
                >
                    <Ionicons name="heart" size={24} color="#E67E22" />
                </TouchableOpacity>

                {/* Color Swatches */}
                {swatches.length > 0 && (
                    <View style={styles.swatchesContainer}>
                        {swatches.map((color: any, index: number) => (
                            <View
                                key={index}
                                style={[
                                    styles.swatch,
                                    { backgroundColor: color.hex },
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Product Details */}
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>{product.product_name}</Text>



                <View style={styles.footer}>
                    <Text style={styles.price}>{Number(price).toLocaleString()} FCFA</Text>

                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => onAddToCart(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cartCircle}>
                            <Ionicons name="cart-outline" size={16} color="#E67E22" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#F9F9F9',
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
    },
    details: {
        paddingTop: 10,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    swatchesContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    swatch: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    variationSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    cartButton: {
        padding: 4,
    },
    cartCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E67E22',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WishlistItem;
