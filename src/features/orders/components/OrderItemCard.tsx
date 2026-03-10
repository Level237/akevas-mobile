import { useRouter } from 'expo-router';
import { ChevronRight, Package } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getOrderItems, getProductImage, getStatusStyles, getStatusText, getTotalItems } from '../utils/orderUtils';

interface OrderItemCardProps {
    order: any;
}

export const OrderItemCard = ({ order }: OrderItemCardProps) => {
    const router = useRouter();

    const orderData = order.order || order;
    const orderItems = useMemo(() => getOrderItems(orderData), [orderData]);
    const totalItems = useMemo(() => getTotalItems(orderItems), [orderItems]);
    const mainImage = useMemo(() => getProductImage(orderItems), [orderItems]);
    const hasVariations = useMemo(() => orderItems.some((item: any) => item.type === 'variation'), [orderItems]);

    // Fallback if no ID is found (shouldn't happen with correct API)
    const orderId = orderData?.id || order?.id || 'Inconnu';
    const status = orderData?.status?.toString() || '0';

    const statusStyle = getStatusStyles(status);
    const dateFormatted = orderData?.created_at ? new Date(orderData.created_at).toLocaleDateString('fr-FR') : 'Date inconnue';
    const priceFormatted = (order?.price || orderData?.total_amount || 0).toLocaleString();

    const handlePress = () => {
        router.push(`/user/orders/${orderId}` as any); // Assuming this route exists
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                {mainImage ? (
                    <Image
                        source={{ uri: mainImage }}
                        style={styles.image}
                        resizeMode="cover"
                        // Handle image error by falling back to placeholder
                        onError={(e) => {
                            // In a real scenario, you might want a state to swap to a local placeholder
                            console.log("Failed to load image", mainImage);
                        }}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Package size={32} color="#9CA3AF" />
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.orderIdText}>Commande #{orderId}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {getStatusText(status)}
                        </Text>
                    </View>
                </View>

                {hasVariations && (
                    <View style={{ alignSelf: 'flex-start', marginBottom: 6 }}>
                        <View style={styles.variationBadge}>
                            <Text style={styles.variationBadgeText}>Produits variés</Text>
                        </View>
                    </View>
                )}

                <Text style={styles.summaryText}>
                    {totalItems} article(s) • <Text style={styles.priceText}>{priceFormatted} FCFA</Text>
                </Text>

                <Text style={styles.dateText}>
                    Commandé le {dateFormatted}
                </Text>

                <View style={styles.itemsPreviewContainer}>
                    {orderItems.slice(0, 2).map((item: any, index: number) => (
                        <Text key={index} style={styles.itemPreviewText} numberOfLines={1}>
                            • {item.name} {item.color ? `(${item.color}) ` : ''}{item.size ? `T:${item.size} ` : ''}
                            <Text style={styles.itemPreviewQty}>x{item.quantity}</Text>
                        </Text>
                    ))}
                    {orderItems.length > 2 && (
                        <Text style={styles.moreItemsText}>
                            +{orderItems.length - 2} autre(s) produit(s)
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.arrowContainer}>
                <ChevronRight size={20} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        marginRight: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    placeholderImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    variationBadge: {
        backgroundColor: '#F3E8FF', // purple-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    variationBadgeText: {
        color: '#6B21A8', // purple-800
        fontSize: 10,
        fontWeight: '600',
    },
    summaryText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 2,
    },
    priceText: {
        fontWeight: '600',
        color: '#1F2937',
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 10,
    },
    itemsPreviewContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
    },
    itemPreviewText: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 2,
    },
    itemPreviewQty: {
        fontWeight: '500',
    },
    moreItemsText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
        fontStyle: 'italic',
    },
    arrowContainer: {
        justifyContent: 'center',
        paddingLeft: 8,
    }
});
