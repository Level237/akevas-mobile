import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItemType } from '../types';

type Props = {
    item: CartItemType;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
};

const CartItem = ({ item, onIncrease, onDecrease, onRemove }: Props) => {
    return (
        <View style={styles.container}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={item.image}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
            </View>

            {/* Product Details */}
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <TouchableOpacity
                        onPress={() => onRemove(item.id)}
                        style={styles.removeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.location}>Ville: {item.location}</Text>

                <View style={styles.footerRow}>
                    {/* Quantity Selector */}
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity
                            onPress={() => onDecrease(item.id)}
                            style={styles.quantityBtn}
                            activeOpacity={0.6}
                        >
                            <Ionicons name="remove" size={16} color="#1A1A1A" />
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={() => onIncrease(item.id)}
                            style={styles.quantityBtn}
                            activeOpacity={0.6}
                        >
                            <Ionicons name="add" size={16} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.price}>{item.price.toLocaleString()} FCFA</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 16,
        // Soft shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    details: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        lineHeight: 20,
        marginRight: 8,
    },
    removeButton: {
        padding: 2,
    },
    location: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        paddingHorizontal: 4,
    },
    quantityBtn: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginHorizontal: 12,
        textAlign: 'center',
        minWidth: 16,
    },
    price: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1A1A1A',
    },
});

export default CartItem;
