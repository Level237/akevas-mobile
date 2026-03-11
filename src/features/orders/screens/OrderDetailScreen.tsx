import HeaderScreen from '@/components/common/HeaderScreen';
import { COLORS } from '@/constants/colors';
import { useGetOrderDetailQuery } from '@/services/authService';
import { useRouter } from 'expo-router';
import {
    Calendar,
    CreditCard,
    Info,
    MapPin,
    Package,
    Receipt
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    getOrderItems,
    getStatusStyles,
    getStatusText,
    getTotalItems
} from '../utils/orderUtils';

const TAX_RATE = 0.03;

const OrderDetailScreen = ({ id }: { id: string }) => {
    const router = useRouter();

    const { data: payment, isLoading } = useGetOrderDetailQuery(Number(id));

    // Extraire les données de commande depuis le paiement
    const orders = payment?.order;
    const currentOrder = orders?.[0];

    const orderItems = useMemo(() => getOrderItems(currentOrder), [currentOrder]);
    const totalItems = useMemo(() => getTotalItems(orderItems), [orderItems]);
    const hasVariations = useMemo(() => orderItems.some((item: any) => item.type === 'variation'), [orderItems]);

    const itemsTotal = useMemo(() => orderItems.reduce((total: number, item: any) => total + item.total, 0), [orderItems]);
    const shippingFee = Number(currentOrder?.fee_of_shipping || 0);
    const taxAmount = itemsTotal * TAX_RATE;
    const totalWithTax = itemsTotal + shippingFee + taxAmount;

    const statusStyle = useMemo(() => getStatusStyles(currentOrder?.status), [currentOrder?.status]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!currentOrder) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <HeaderScreen title="Détail Commande" />
                <View style={styles.errorContainer}>
                    <Package size={64} color="#9CA3AF" />
                    <Text style={styles.errorText}>Commande non trouvée</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Retour aux commandes</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <HeaderScreen title={`Commande #${id}`} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Status Section */}
                <View style={styles.section}>
                    <View style={styles.statusCard}>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>Statut actuel</Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                                    {getStatusText(currentOrder?.status)}
                                </Text>
                            </View>
                        </View>
                        {hasVariations && (
                            <View style={styles.variationBadge}>
                                <Text style={styles.variationBadgeText}>Contient des produits variés</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.receiptButton}
                            onPress={() => router.push(`/orders/ticket/${payment.transaction_ref}` as any)}
                        >
                            <Receipt size={20} color="#FFF" />
                            <Text style={styles.receiptButtonText}>Voir le Reçu</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Info size={20} color={COLORS.primary} />
                            <Text style={styles.cardTitle}>Résumé de la commande</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Calendar size={16} color="#6B7280" />
                                <Text style={styles.detailLabel}>Date</Text>
                            </View>
                            <Text style={styles.detailValue}>
                                {currentOrder?.created_at ? currentOrder.created_at.split('T')[0] : 'N/A'}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <CreditCard size={16} color="#6B7280" />
                                <Text style={styles.detailLabel}>Paiement</Text>
                            </View>
                            <Text style={styles.detailValue}>
                                {currentOrder?.payment_method === "1" ? "Carte de crédit" : "Mobile Money"}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Articles ({totalItems})</Text>
                            <Text style={styles.priceValue}>{itemsTotal.toLocaleString()} XAF</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Livraison</Text>
                            <Text style={styles.priceValue}>{shippingFee.toLocaleString()} XAF</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Taxe (3%)</Text>
                            <Text style={styles.priceValue}>{taxAmount.toLocaleString()} XAF</Text>
                        </View>
                        <View style={[styles.priceRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total TTC</Text>
                            <Text style={styles.totalValue}>{totalWithTax.toLocaleString()} XAF</Text>
                        </View>
                    </View>
                </View>

                {/* Address Section */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MapPin size={20} color={COLORS.primary} />
                            <Text style={styles.cardTitle}>Adresse de livraison</Text>
                        </View>
                        <View style={styles.addressContent}>
                            <Text style={styles.userName}>{currentOrder?.userName}</Text>
                            <Text style={styles.addressText}>
                                {currentOrder.quarter_delivery ? currentOrder?.quarter_delivery : currentOrder?.emplacement}
                            </Text>
                            <Text style={styles.phoneText}>{currentOrder?.userPhone}</Text>
                        </View>
                    </View>
                </View>

                {/* Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Articles commandés</Text>
                    {orderItems.map((item: any, index: number) => (
                        <View key={item.id || index} style={styles.itemCard}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                <View style={styles.itemMeta}>
                                    <Text style={styles.itemQty}>Qté: {item.quantity}</Text>
                                    {item.color && (
                                        <View style={styles.metaBadge}>
                                            <Text style={styles.metaBadgeText}>{item.color}</Text>
                                        </View>
                                    )}
                                    {item.size && (
                                        <View style={styles.metaBadge}>
                                            <Text style={styles.metaBadgeText}>T: {item.size}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.itemUnitPrice}>{item.price.toLocaleString()} XAF / unité</Text>
                            </View>
                            <View style={styles.itemTotalContainer}>
                                <Text style={styles.itemTotal}>{item.total.toLocaleString()} XAF</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        marginVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    statusCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    statusInfo: {
        alignItems: 'center',
        marginBottom: 12,
    },
    statusLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusBadgeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    variationBadge: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 16,
    },
    variationBadgeText: {
        color: '#6B21A8',
        fontSize: 12,
        fontWeight: '600',
    },
    receiptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981', // green-500
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
        width: '100%',
        justifyContent: 'center',
    },
    receiptButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.primary,
    },
    addressContent: {
        gap: 4,
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    addressText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    phoneText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    itemQty: {
        fontSize: 12,
        color: '#6B7280',
    },
    metaBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    metaBadgeText: {
        fontSize: 10,
        color: '#4B5563',
        fontWeight: '500',
    },
    itemUnitPrice: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    itemTotalContainer: {
        marginLeft: 8,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    }
});

export default OrderDetailScreen;
