import { COLORS } from '@/constants/colors';
import { useShowPaymentWithReferenceQuery } from '@/services/authService';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, Package } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getOrderItems, getStatusStyles, getStatusText } from '../utils/orderUtils';

const { width } = Dimensions.get('window');

interface OrderTicketDetailScreenProps {
    reference: string;
}

const TAX_RATE = 0.03;

const OrderTicketDetailScreen = ({ reference }: OrderTicketDetailScreenProps) => {
    const router = useRouter();
    const { data: payment, isLoading, error } = useShowPaymentWithReferenceQuery(reference);

    const mainOrder = useMemo(() => payment?.order?.[0], [payment]);

    const allProducts = useMemo(() => {
        if (!payment?.order) return [];
        const products: any[] = [];
        payment.order.forEach((order: any) => {
            products.push(...getOrderItems(order));
        });
        return products;
    }, [payment]);

    const totals = useMemo(() => {
        const itemsTotal = allProducts.reduce((total: number, item: any) => total + item.total, 0);
        const shippingFee = Number(mainOrder?.fee_of_shipping || 0);
        const taxAmount = itemsTotal * TAX_RATE;
        const totalWithTax = itemsTotal + shippingFee + taxAmount;
        return { itemsTotal, shippingFee, taxAmount, totalWithTax };
    }, [allProducts, mainOrder]);

    const statusStyle = useMemo(() => getStatusStyles(mainOrder?.status), [mainOrder?.status]);
    const dateFormatted = useMemo(() => {
        if (!mainOrder?.created_at) return 'N/A';
        return new Date(mainOrder.created_at).toLocaleDateString('fr-FR');
    }, [mainOrder?.created_at]);

    // Barcode simulation component
    const Barcode = React.memo(() => (
        <View style={styles.barcodeContainer}>
            <View style={styles.barcodeLines}>
                {Array.from({ length: 30 }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.barcodeLine,
                            {
                                width: Math.random() > 0.5 ? 1.5 : 3,
                                opacity: 0.8 + Math.random() * 0.2
                            }
                        ]}
                    />
                ))}
            </View>
            <Text style={styles.barcodeText}>{reference}</Text>
        </View>
    ));

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary || "#E67E22"} />
            </View>
        );
    }

    if (error || !payment || (payment as any).code === 404) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Package size={64} color="#9CA3AF" />
                    <Text style={styles.errorTitle}>Ticket introuvable</Text>
                    <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Retour à l'accueil</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ticket de Paiement</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.ticketContainer}>
                    {/* Ticket Header */}
                    <View style={styles.ticketHeader}>
                        {/* Logo & Identity */}
                        <View style={styles.identityRow}>
                            <Image
                                source={require('@/assets/images/icon.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <View style={styles.identityText}>
                                <Text style={styles.companyName}>AKEVAS ONLINE STORE</Text>
                                <Text style={styles.countryName}>République du Cameroun</Text>
                            </View>
                        </View>

                        <View style={styles.dividerThin} />

                        {/* Title & Barcode */}
                        <View style={styles.receiptTitleContainer}>
                            <Barcode />
                            <View style={styles.titleWrapper}>
                                <Text style={styles.receiptTitle}>REÇU DE PAIEMENT</Text>
                                <Text style={styles.receiptTitleEn}>PAYMENT RECEIPT</Text>
                            </View>
                        </View>
                    </View>

                    {/* Section: Payment Info */}
                    <View style={styles.sectionTitleBar}>
                        <Text style={styles.sectionTitleText}>INFORMATIONS SUR LE PAIEMENT / PAYMENT INFO</Text>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelCell}>
                                <Text style={styles.infoLabel}>NOM COMPLET / FULL NAME</Text>
                            </View>
                            <View style={styles.infoValueCell}>
                                <Text style={styles.infoValue}>{payment.user}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRowSplit}>
                            <View style={styles.infoCellHalf}>
                                <View style={styles.infoLabelCell}>
                                    <Text style={styles.infoLabel}>RÉFÉRENCE / REF</Text>
                                </View>
                                <View style={styles.infoValueCell}>
                                    <Text style={styles.infoValueMono}>{payment.transaction_ref}</Text>
                                </View>
                            </View>
                            <View style={styles.infoCellHalf}>
                                <View style={styles.infoLabelCell}>
                                    <Text style={styles.infoLabel}>DATE / DATE</Text>
                                </View>
                                <View style={styles.infoValueCell}>
                                    <Text style={styles.infoValue}>{dateFormatted}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelCell}>
                                <Text style={styles.infoLabel}>STATUT / STATUS</Text>
                            </View>
                            <View style={styles.infoValueCell}>
                                <Text style={[styles.infoValueBold, { color: statusStyle.text }]}>
                                    {getStatusText(mainOrder?.status).toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelCell}>
                                <Text style={styles.infoLabel}>OBJET / PURPOSE</Text>
                            </View>
                            <View style={styles.infoValueCell}>
                                <Text style={styles.infoValue}>{payment.payment_of}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelCell}>
                                <Text style={styles.infoLabel}>ADRESSE / ADDRESS</Text>
                            </View>
                            <View style={styles.infoValueCell}>
                                <Text style={styles.infoValueSmallBold}>{mainOrder.userName}</Text>
                                <Text style={styles.infoValueSmall}>
                                    {mainOrder.quarter_delivery || mainOrder.emplacement}
                                </Text>
                                <Text style={styles.infoValueSmall}>{mainOrder.userPhone}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Section: Products */}
                    <View style={styles.sectionTitleBar}>
                        <Text style={styles.sectionTitleText}>DÉTAILS DES PRODUITS / PRODUCT DETAILS</Text>
                    </View>

                    <View style={styles.productsTable}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>PRODUIT</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.2, textAlign: 'center' }]}>QTÉ</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.3, textAlign: 'right' }]}>P.U</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.3, textAlign: 'right' }]}>TOTAL</Text>
                        </View>

                        {allProducts.map((prod, idx) => (
                            <View key={idx} style={[styles.tableRow, idx === allProducts.length - 1 && { borderBottomWidth: 0 }]}>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                                    {(prod.color || prod.size) && (
                                        <Text style={styles.productMeta}>
                                            {prod.color ? `Col: ${prod.color}` : ''}
                                            {prod.color && prod.size ? ' | ' : ''}
                                            {prod.size ? `T: ${prod.size}` : ''}
                                        </Text>
                                    )}
                                </View>
                                <Text style={[styles.tableCell, { flex: 0.2, textAlign: 'center' }]}>{prod.quantity}</Text>
                                <Text style={[styles.tableCell, { flex: 0.3, textAlign: 'right' }]}>
                                    {Math.round(prod.price).toLocaleString()}
                                </Text>
                                <Text style={[styles.productTotal, { flex: 0.3, textAlign: 'right' }]}>
                                    {Math.round(prod.total).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Totals Section */}
                    <View style={styles.totalsContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>SOUS-TOTAL / SUBTOTAL:</Text>
                            <Text style={styles.totalValue}>{totals.itemsTotal.toLocaleString()} XAF</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>LIVRAISON / SHIPPING:</Text>
                            <Text style={styles.totalValue}>{totals.shippingFee.toLocaleString()} XAF</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>FRAIS / TAX (3%):</Text>
                            <Text style={styles.totalValue}>
                                {totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAF
                            </Text>
                        </View>
                        <View style={styles.dividerDashed} />
                        <View style={[styles.totalRow, { marginTop: 4 }]}>
                            <Text style={styles.finalTotalLabel}>TOTAL (TTC):</Text>
                            <Text style={styles.finalTotalValue}>
                                {totals.totalWithTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAF
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.ticketFooter}>
                        <Text style={styles.footerNote}>
                            Ce document est un reçu électronique généré par Akevas.
                        </Text>
                        <Text style={styles.footerNote}>
                            This document is an electronic receipt generated by Akevas.
                        </Text>
                    </View>
                </View>

                {/* Download Button */}
                <TouchableOpacity style={styles.actionButton}>
                    <Download size={20} color="#FFF" />
                    <Text style={styles.actionButtonText}>Télécharger le reçu (PDF)</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    scrollContent: {
        padding: 12,
        paddingBottom: 40,
    },
    ticketContainer: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#1F2937',
        padding: 2,
    },
    ticketHeader: {
        borderBottomWidth: 2,
        borderColor: '#1F2937',
        padding: 12,
    },
    identityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    identityText: {
        marginLeft: 12,
        flex: 1,
    },
    companyName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
    },
    countryName: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4B5563',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    dividerThin: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 10,
    },
    receiptTitleContainer: {
        alignItems: 'center',
    },
    barcodeContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    barcodeLines: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'flex-end',
        gap: 1.5,
    },
    barcodeLine: {
        backgroundColor: '#000',
        height: '100%',
    },
    barcodeText: {
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: 2,
        marginTop: 4,
        color: '#1F2937',
    },
    titleWrapper: {
        borderTopWidth: 2,
        borderColor: '#1F2937',
        width: '100%',
        paddingTop: 8,
        alignItems: 'center',
    },
    receiptTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F2937',
    },
    receiptTitleEn: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
    },
    sectionTitleBar: {
        backgroundColor: '#93C5FD',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#1F2937',
    },
    sectionTitleText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
    },
    infoGrid: {
        borderBottomWidth: 1,
        borderColor: '#1F2937',
    },
    infoRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#1F2937',
    },
    infoRowSplit: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#1F2937',
    },
    infoCellHalf: {
        flex: 1,
        flexDirection: 'row',
    },
    infoLabelCell: {
        width: '40%',
        backgroundColor: '#EFF6FF',
        padding: 8,
        borderRightWidth: 1,
        borderColor: '#1F2937',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#1F2937',
        textTransform: 'uppercase',
    },
    infoValueCell: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    infoValue: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1F2937',
        textTransform: 'uppercase',
    },
    infoValueMono: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: '#1F2937',
    },
    infoValueBold: {
        fontSize: 11,
        fontWeight: '800',
    },
    infoValueSmallBold: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1F2937',
        textTransform: 'uppercase',
    },
    infoValueSmall: {
        fontSize: 10,
        color: '#4B5563',
        marginTop: 2,
        textTransform: 'uppercase',
    },
    productsTable: {
        borderBottomWidth: 1,
        borderColor: '#1F2937',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#1F2937',
    },
    tableHeaderText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#1F2937',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    productName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1F2937',
        textTransform: 'uppercase',
    },
    productMeta: {
        fontSize: 9,
        color: '#6B7280',
        marginTop: 2,
    },
    tableCell: {
        fontSize: 11,
        color: '#1F2937',
    },
    productTotal: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1F2937',
    },
    totalsContainer: {
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderColor: '#1F2937',
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4B5563',
    },
    totalValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1F2937',
    },
    dividerDashed: {
        height: 1,
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#1F2937',
        borderStyle: 'dashed',
        marginVertical: 4,
    },
    finalTotalLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#1F2937',
    },
    finalTotalValue: {
        fontSize: 14,
        fontWeight: '900',
        color: COLORS.primary || '#E67E22',
    },
    ticketFooter: {
        padding: 12,
        alignItems: 'center',
    },
    footerNote: {
        fontSize: 8,
        color: '#9CA3AF',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#10B981',
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#374151',
        marginTop: 16,
        marginBottom: 24,
    },
    backButtonLarge: {
        backgroundColor: COLORS.primary || "#E67E22",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    }
});

export default OrderTicketDetailScreen;
