import { COLORS } from '@/constants/colors';
import { useShowPaymentWithReferenceQuery } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Download, Package } from 'lucide-react-native';
import React, { useMemo, useRef } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import TicketView from '../components/TicketView';
import { getOrderItems } from '../utils/orderUtils';

const { width } = Dimensions.get('window');

interface OrderTicketDetailScreenProps {
    reference: string;
}

const TAX_RATE = 0.03;





const OrderTicketDetailScreen = ({ reference }: OrderTicketDetailScreenProps) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data: payment, isLoading, error } = useShowPaymentWithReferenceQuery(reference);
    const viewRef = useRef<any>(null);
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

    const handleDownload = async () => {
        try {
            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 0.9,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: 'Enregistrer le ticket',
                });
            } else {
                Alert.alert("Information", "Le partage n'est pas disponible sur votre appareil.");
            }
        } catch (err) {
            console.error("Capture error:", err);
            Alert.alert("Erreur", "Impossible de générer l'image du ticket.");
        }
    };




    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ticket de Paiement</Text>
            <View style={{ width: 40 }} />
        </View>
    );


    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary || "#E67E22"} />
            </View>
        );
    }

    if (error || !payment || (payment as any).code === 404) {
        return (
            <View style={{ paddingTop: insets.top }}>
                <View style={styles.errorContainer}>
                    <Package size={64} color="#9CA3AF" />
                    <Text style={styles.errorTitle}>Ticket introuvable</Text>
                    <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Retour à l'accueil</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.safeArea}>
            {renderHeader()}

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ViewShot ref={viewRef} options={{ format: 'png', quality: 1 }}>
                    <TicketView payment={payment} allProducts={allProducts} totals={totals} mainOrder={mainOrder} reference={reference} />
                </ViewShot>

                {/* Download Button */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDownload}
                >
                    <Download size={20} color="#FFF" />
                    <Text style={styles.actionButtonText}>Télécharger le reçu</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
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
    backBtn: {
        padding: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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
