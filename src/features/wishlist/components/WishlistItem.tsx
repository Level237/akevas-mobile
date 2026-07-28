import { FavoriteItem } from '@/store/FavoriteSlice';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => onPress?.(item)}
        >
            {/* Product Image - Portrait 3:4 */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.product_profile }}
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
            </View>

            {/* Product Details */}
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>{product.product_name}</Text>

                {selectedVariation && (
                    <Text style={styles.variationSubtitle} numberOfLines={1}>
                        {selectedVariation.color.name}
                        {selectedVariation.attributes ? ` - ${selectedVariation.attributes.value}` : ''}
                    </Text>
                )}

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
