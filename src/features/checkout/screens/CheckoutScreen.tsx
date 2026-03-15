
import { COLORS } from '@/constants/colors';
import { useAppSelector } from '@/hooks/hooks';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useGetUserQuery } from '@/services/authService';
import { useGetQuartersQuery } from '@/services/guardService';
import { selectCartItems, selectCartTotalPrice } from '@/store/CartSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CheckCircle2, CreditCard, MapPin, Truck, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DeliveryOption = 'pickup' | 'localDelivery' | 'remotePickup' | 'remoteDelivery';

const TAX_RATE = 0.03;

const DELIVERY_FEES: Record<DeliveryOption, number> = {
    pickup: 0,
    localDelivery: 1500,
    remotePickup: 2500,
    remoteDelivery: 3500,
};

interface Props {
    params: any;
}

const CheckoutScreen = ({ params }: Props) => {
    const insets = useSafeAreaInsets();
    const isAuthenticated = useRequireAuth()
    const router = useRouter();
    const { data: userData } = useGetUserQuery(undefined);
    const { data: quartersData, isLoading: quartersLoading } = useGetQuartersQuery(undefined);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
    const [selectedQuarter, setSelectedQuarter] = useState<string>('');
    const [addressDetails, setAddressDetails] = useState('');
    const [firstName, setFirstName] = useState(userData?.firstName || '');
    const [lastName, setLastName] = useState(userData?.lastName || '');
    const [phone, setPhone] = useState(userData?.phone_number || '');
    const [paymentPhone, setPaymentPhone] = useState(userData?.phone_number || '');
    const [selectedPayment, setSelectedPayment] = useState<'cm.orange' | 'cm.mtn'>('cm.orange');
    const [isProcessing, setIsProcessing] = useState(false);

    // Modal Quartier
    const [isQuarterModalVisible, setIsQuarterModalVisible] = useState(false);
    const [isCityModalVisible, setIsCityModalVisible] = useState(false);
    const [quarterSearch, setQuarterSearch] = useState('');

    // Extraction des paramètres
    const s = params.s;

    const productId = params.productId;
    const quantity = parseInt(params.quantity || '1');
    const unitPrice = params.price ? parseInt(params.price) / quantity : 0;
    const productName = params.name;
    const residence = params.residence;
    const variationInfo = params.variationParams ? JSON.parse(params.variationParams) : null;

    const cartItems = useAppSelector(selectCartItems);
    const cartTotalPrice = useAppSelector(selectCartTotalPrice);

    const uniqueCities = useMemo(() => Array.from(
        new Set(cartItems.map((item: any) => item.product.residence))
    ), [cartItems]);

    const isMultiCity = s === "1" && uniqueCities.length > 1;

    const productLocation = useMemo(() =>
        s === "1"
            ? (uniqueCities.length === 1
                ? uniqueCities[0]
                : (selectedCity || '') // si plusieurs villes, on prend celle choisie
            )
            : residence
        , [s, uniqueCities, selectedCity, residence]);

    const otherLocation = productLocation === "Yaoundé" ? "Douala" : "Yaoundé";

    useEffect(() => {
        if (userData) {
            if (!firstName) setFirstName(userData.firstName || '');
            if (!lastName) setLastName(userData.lastName || '');
            if (!phone) {
                setPhone(userData.phone_number || '');
                setPaymentPhone(userData.phone_number || '');
            }
        }
    }, [userData]);

    const subtotal = s === '1' ? cartTotalPrice : (unitPrice * quantity);
    const shippingFee = useMemo(() => {
        if (isMultiCity && deliveryOption === 'pickup') {
            return 1500;
        }
        return DELIVERY_FEES[deliveryOption];
    }, [isMultiCity, deliveryOption]);
    const serviceFee = subtotal * TAX_RATE;
    const total = subtotal + shippingFee + serviceFee;

    const filteredQuarters = useMemo(() => {
        if (!quartersData?.data) return [];

        const baseQuarters = quartersData.data.filter((q: any) => {
            if (deliveryOption === 'remoteDelivery') {
                // Multi-ville : quartiers de la ville choisie ou l'autre ville
                if (isMultiCity) return q.town_name === selectedCity;
                return q.town_name === otherLocation;
            }
            // localDelivery : quartiers de la ville de résidence ou choisie
            return q.town_name === (isMultiCity ? (selectedCity || uniqueCities[0]) : productLocation);
        });

        if (!quarterSearch) return baseQuarters;
        return baseQuarters.filter((q: any) =>
            q.quarter_name.toLowerCase().includes(quarterSearch.toLowerCase())
        );
    }, [quartersData, deliveryOption, residence, isMultiCity, selectedCity, otherLocation, productLocation, uniqueCities, quarterSearch]);

    const handlePayment = useCallback(() => {
        if ((deliveryOption === 'localDelivery' || deliveryOption === 'remoteDelivery') && !selectedQuarter) {
            Alert.alert('Erreur', 'Veuillez choisir un quartier de livraison');
            return;
        }
        if (!paymentPhone || paymentPhone.length < 9) {
            Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone de paiement valide');
            return;
        }
        if (!firstName) {
            Alert.alert('Erreur', 'Veuillez entrer votre prénom');
            return;
        }

        setIsProcessing(true);

        // Logic from CheckoutPage.tsx for productsPayments
        let productsPayments = [] as any;
        if (s === '1') {
            productsPayments = cartItems.map((item: any) => ({
                product_id: item.product.id,
                attributeVariationId: item.selectedVariation?.attributes?.id ?? null,
                productVariationId: item.selectedVariation?.id ?? null,
                quantity: item.quantity,
                hasVariation: !!item.selectedVariation,
                price: item.selectedVariation?.attributes?.price
                    ? item.selectedVariation.attributes.price
                    : (item.selectedVariation?.price || item.product.product_price),
                name: item.product.product_name,
            }));
        }

        const orderData = {
            s: s || '0',
            productId,
            quantity: s === '1' ? cartItems.reduce((sum, item) => sum + item.quantity, 0).toString() : quantity.toString(),
            name: s === '1' ? 'Cart Checkout' : productName,
            price: subtotal.toString(),
            amount: Math.round(total).toString(),
            hasVariation: s === '1' ? 'true' : (variationInfo ? 'true' : 'false'),
            variations: s === '0' && variationInfo ? JSON.stringify({
                productVariationId: variationInfo.productVariationId,
                attributeVariationId: variationInfo.attributeVariationId,
                colorName: variationInfo.colorName,
                colorHex: variationInfo.colorHex,
                attribute: variationInfo.attribute
            }) : null,
            productsPayments: s === '1' ? JSON.stringify(productsPayments) : null,
            quarter: selectedQuarter,
            phone: phone,
            address: addressDetails,
            shipping: shippingFee.toString(),
            paymentMethod: selectedPayment,
            paymentPhone: paymentPhone,
            isMultiCity: isMultiCity ? 'true' : 'false',
            delivery_info: isMultiCity ? (shippingFee === 1500 ? `Récupérer en magasin de ${selectedCity}` : `Expédition et livraison à domicile dans la ville de ${selectedCity}`) : null
        };

        console.log('Finalizing order:', orderData);

        console.log('Finalizing order:', orderData);

        // Redirection vers le flux de paiement
        router.push({
            pathname: '/checkout/payment' as any,
            params: {
                orderData: JSON.stringify(orderData)
            }
        });
        setIsProcessing(false);
    }, [deliveryOption, selectedQuarter, paymentPhone, firstName, productId, quantity, productName, subtotal, total, variationInfo, phone, addressDetails, shippingFee, selectedPayment]);

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Finaliser la commande</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                {icon}
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    if (!isAuthenticated) return null;
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            {renderHeader()}
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Multi-City Warning */}
                {isMultiCity && (
                    <View style={styles.warningCard}>
                        <View style={styles.warningHeader}>
                            <Ionicons name="warning" size={20} color="#EF4444" />
                            <Text style={styles.warningTitle}>Produits dans différentes villes</Text>
                        </View>
                        <Text style={styles.warningText}>Les produits de votre panier ne sont pas tous situés dans la même ville.</Text>
                        <TouchableOpacity
                            style={styles.viewByCityBtn}
                            onPress={() => setIsCityModalVisible(true)}
                        >
                            <Text style={styles.viewByCityBtnText}>Voir les produits par ville</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* City Selector if Multi-City */}
                {isMultiCity && (
                    renderSection('Ville de livraison', <MapPin size={20} color={COLORS.primary} />, (
                        <View style={styles.form}>
                            <Text style={styles.inputLabel}>Choisissez la ville de livraison :</Text>
                            <TouchableOpacity
                                style={styles.selectInput}
                                onPress={() => setIsCityModalVisible(true)}
                            >
                                <Text style={selectedCity ? styles.inputText : styles.placeholderText}>
                                    {selectedCity || 'Choisir une ville'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {/* Résumé des Produits */}
                {renderSection('Résumé de la commande', <Ionicons name="basket" size={20} color={COLORS.primary} />, (
                    <View style={styles.productList}>
                        {s === '1' ? (
                            cartItems.map((item: any, index) => (
                                <View key={`${item.product.id}-${index}`} style={styles.productListItem}>
                                    <Image
                                        source={{ uri: item.product.product_profile }}
                                        style={styles.smallProductImage}
                                    />
                                    <View style={styles.productItemDetails}>
                                        <Text style={styles.productItemName} numberOfLines={1}>{item.product.product_name}</Text>
                                        <Text style={styles.productItemPrice}>
                                            {(item.selectedVariation?.price || item.product.product_price).toLocaleString()} FCFA x {item.quantity}
                                        </Text>
                                        {item.selectedVariation && (
                                            <View style={styles.row}>
                                                <View
                                                    style={[
                                                        styles.colorDot,
                                                        { backgroundColor: item.selectedVariation.color?.hex || '#CCC' },
                                                        { marginRight: 4 }
                                                    ]}
                                                />
                                                <Text style={styles.variantText}>
                                                    {item.selectedVariation.color?.name}{item.selectedVariation.attributes?.value ? ` - ${item.selectedVariation.attributes.value}` : ''}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.productListItem}>
                                <Image
                                    source={{ uri: params.mainImage }}
                                    style={styles.smallProductImage}
                                />
                                <View style={styles.productItemDetails}>
                                    <Text style={styles.productItemName} numberOfLines={1}>{productName}</Text>
                                    <Text style={styles.productItemPrice}>{unitPrice.toLocaleString()} FCFA x {quantity}</Text>
                                    {variationInfo && (
                                        <View style={styles.row}>
                                            <View
                                                style={[
                                                    styles.colorDot,
                                                    { backgroundColor: variationInfo.colorHex || '#CCC' },
                                                    { marginRight: 4 }
                                                ]}
                                            />
                                            <Text style={styles.variantText}>
                                                {variationInfo.colorName}{variationInfo.attribute ? ` - ${variationInfo.attribute}` : ''}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                ))}

                {/* Options de Livraison (Updated with logic) */}
                {(!isMultiCity || (isMultiCity && selectedCity)) && renderSection('Options de livraison', <Truck size={20} color={COLORS.primary} />, (
                    <View style={styles.deliveryOptionsGrid}>
                        {(!isMultiCity ? ['pickup', 'localDelivery', 'remotePickup', 'remoteDelivery'] : ['pickup', 'remoteDelivery'] as DeliveryOption[]).map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.deliveryOptionItem,
                                    deliveryOption === option && styles.activeOption
                                ]}
                                onPress={() => setDeliveryOption(option as DeliveryOption)}
                            >
                                <Text style={[styles.optionLabel, deliveryOption === option && styles.activeOptionLabel]}>
                                    {option === 'pickup' && (isMultiCity ? `Magasin de ${selectedCity}` : `Magasin de ${residence}`)}
                                    {option === 'localDelivery' && 'Livraison Locale'}
                                    {option === 'remotePickup' && `Expédition Magasin`}
                                    {option === 'remoteDelivery' && (isMultiCity ? `Expédition ${selectedCity}` : `Expédition Domicile`)}
                                </Text>
                                <Text style={styles.optionFee}>
                                    {option === 'pickup' && isMultiCity ? '+1,500 FCFA' : (DELIVERY_FEES[option as DeliveryOption] === 0 ? 'Gratuit' : `+${DELIVERY_FEES[option as DeliveryOption].toLocaleString()} FCFA`)}
                                </Text>
                                {deliveryOption === option && (
                                    <View style={styles.checkBadge}>
                                        <CheckCircle2 size={14} color="#FFF" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Détails Adresse si livraison */}
                {(deliveryOption === 'localDelivery' || deliveryOption === 'remoteDelivery') && (
                    renderSection('Détails de livraison', <MapPin size={20} color={COLORS.primary} />, (
                        <View style={styles.form}>
                            <Text style={styles.inputLabel}>Quartier</Text>
                            <TouchableOpacity
                                style={styles.selectInput}
                                onPress={() => setIsQuarterModalVisible(true)}
                            >
                                <Text style={selectedQuarter ? styles.inputText : styles.placeholderText}>
                                    {selectedQuarter || 'Choisir un quartier'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <Text style={styles.inputLabel}>Adresse précise</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Numéro de rue, repères..."
                                value={addressDetails}
                                onChangeText={setAddressDetails}
                                multiline
                            />
                        </View>
                    ))
                )}

                {/* Informations Client */}
                {renderSection('Informations de contact', <User size={20} color={COLORS.primary} />, (
                    <View style={styles.form}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.inputLabel}>Prénom</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.inputLabel}>Nom</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>
                        <Text style={styles.inputLabel}>Téléphone principal</Text>
                        <TextInput
                            style={styles.textInput}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                ))}

                {/* Paiement */}
                {renderSection('Méthode de paiement', <CreditCard size={20} color={COLORS.primary} />, (
                    <View style={styles.paymentContainer}>
                        <View style={styles.paymentMethods}>
                            <TouchableOpacity
                                style={[styles.paymentBtn, selectedPayment === 'cm.orange' && styles.activePayment]}
                                onPress={() => setSelectedPayment('cm.orange')}
                            >
                                <Image
                                    source={require('@/assets/images/orange.png')} // S'assurer que les assets existent
                                    style={styles.paymentIcon}
                                    resizeMode="contain"
                                />
                                <Text style={styles.paymentLabel}>Orange Money</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.paymentBtn, selectedPayment === 'cm.mtn' && styles.activePayment]}
                                onPress={() => setSelectedPayment('cm.mtn')}
                            >
                                <Image
                                    source={require('@/assets/images/momo.png')}
                                    style={styles.paymentIcon}
                                    resizeMode="contain"
                                />
                                <Text style={styles.paymentLabel}>MTN MoMo</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Numéro de paiement</Text>
                        <TextInput
                            style={styles.textInput}
                            value={paymentPhone}
                            onChangeText={setPaymentPhone}
                            keyboardType="phone-pad"
                            placeholder="6XXXXXXXX"
                        />
                    </View>
                ))}

                {/* Résumé des coûts */}
                <View style={styles.costSummary}>
                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Sous-total</Text>
                        <Text style={styles.costValue}>{subtotal.toLocaleString()} FCFA</Text>
                    </View>
                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Livraison</Text>
                        <Text style={[styles.costValue, shippingFee === 0 && { color: '#10B981' }]}>
                            {shippingFee === 0 ? 'Gratuit' : `${shippingFee.toLocaleString()} FCFA`}
                        </Text>
                    </View>
                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Frais de service (3%)</Text>
                        <Text style={styles.costValue}>{Math.round(serviceFee).toLocaleString()} FCFA</Text>
                    </View>
                    <View style={[styles.costRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total TTC</Text>
                        <Text style={styles.totalValue}>{Math.round(total).toLocaleString()} FCFA</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footers */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <TouchableOpacity
                    style={[styles.payButton, isProcessing && styles.disabledButton]}
                    onPress={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.payButtonText}>Payer {Math.round(total).toLocaleString()} FCFA</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Modal de Sélection de Ville (Multi-city) */}
            <Modal
                visible={isCityModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsCityModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.cityModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Produits par ville</Text>
                            <TouchableOpacity onPress={() => setIsCityModalVisible(false)} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.cityList}>
                            {uniqueCities.map(city => {
                                const cityProducts = cartItems.filter((item: any) => item.product.residence === city);
                                return (
                                    <View key={city} style={styles.citySection}>
                                        <TouchableOpacity
                                            style={[styles.cityHeader, selectedCity === city && styles.activeCityHeader]}
                                            onPress={() => {
                                                setSelectedCity(city);
                                                setIsCityModalVisible(false);
                                            }}
                                        >
                                            <Text style={styles.cityName}>{city}</Text>
                                            {selectedCity === city && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                                        </TouchableOpacity>
                                        <View style={styles.cityProducts}>
                                            {cityProducts.map((item: any, idx: number) => (
                                                <View key={idx} style={styles.cityProductItem}>
                                                    <Image source={{ uri: item.product.product_profile }} style={styles.tinyImage} />
                                                    <View>
                                                        <Text style={styles.tinyName}>{item.product.product_name}</Text>
                                                        <Text style={styles.tinyQty}>Qté: {item.quantity}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Sélection de Quartier */}
            <Modal
                visible={isQuarterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsQuarterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingTop: insets.top + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choisir un quartier</Text>
                            <TouchableOpacity
                                onPress={() => setIsQuarterModalVisible(false)}
                                style={styles.modalCloseBtn}
                            >
                                <Ionicons name="close" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalSearchContainer}>
                            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                style={styles.modalSearchInput}
                                placeholder="Rechercher un quartier..."
                                value={quarterSearch}
                                onChangeText={setQuarterSearch}
                                autoFocus
                            />
                        </View>

                        <FlatList
                            data={filteredQuarters}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.quarterItem}
                                    onPress={() => {
                                        setSelectedQuarter(item.quarter_name);
                                        setIsQuarterModalVisible(false);
                                        setQuarterSearch('');
                                    }}
                                >
                                    <View style={styles.quarterInfo}>
                                        <Text style={styles.quarterName}>{item.quarter_name}</Text>
                                        <Text style={styles.townName}>{item.town_name}</Text>
                                    </View>
                                    {selectedQuarter === item.quarter_name && (
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyResults}>
                                    <Text style={styles.emptyText}>Aucun quartier trouvé</Text>
                                </View>
                            }
                            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
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
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    scrollContent: {
        padding: 16,
    },
    productSummaryCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    summaryDetails: {
        flex: 1,
        marginLeft: 12,
    },
    summaryName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    summaryPrice: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    summaryVariant: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
        marginTop: 2,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },
    sectionContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    deliveryOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    deliveryOptionItem: {
        flex: 1,
        minWidth: '45%',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
        position: 'relative',
    },
    activeOption: {
        borderColor: COLORS.primary,
        backgroundColor: '#EEF2FF',
    },
    optionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 4,
    },
    activeOptionLabel: {
        color: COLORS.primary,
    },
    optionFee: {
        fontSize: 11,
        color: '#6B7280',
    },
    checkBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: COLORS.primary,
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    form: {
        gap: 12,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 4,
    },
    textInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputText: {
        fontSize: 15,
        color: '#1F2937',
    },
    placeholderText: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    row: {
        flexDirection: 'row',
    },
    paymentContainer: {
        gap: 16,
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 12,
    },
    paymentBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
    },
    activePayment: {
        borderColor: COLORS.primary,
        backgroundColor: '#EEF2FF',
    },
    paymentIcon: {
        width: 32,
        height: 32,
    },
    paymentLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    costSummary: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 8,
        gap: 12,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    costLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    costValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    payButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    payButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        paddingHorizontal: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    modalCloseBtn: {
        padding: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 8,
    },
    modalSearchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    quarterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    quarterInfo: {
        flex: 1,
    },
    quarterName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    townName: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    emptyResults: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
    },
    // Style refinements for multi-city
    warningCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#991B1B',
    },
    warningText: {
        fontSize: 13,
        color: '#B91C1C',
        lineHeight: 18,
        marginBottom: 12,
    },
    viewByCityBtn: {
        backgroundColor: '#EF4444',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    viewByCityBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    productList: {
        gap: 12,
    },
    productListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    smallProductImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
    },
    productItemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    productItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    productItemPrice: {
        fontSize: 13,
        color: '#6B7280',
    },
    cityModalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        height: '60%',
        padding: 24,
    },
    cityList: {
        marginTop: 10,
    },
    citySection: {
        marginBottom: 20,
    },
    cityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 8,
    },
    activeCityHeader: {
        backgroundColor: '#EEF2FF',
        borderColor: COLORS.primary,
        borderWidth: 1,
    },
    cityName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },
    cityProducts: {
        paddingLeft: 12,
        gap: 8,
    },
    cityProductItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    tinyImage: {
        width: 32,
        height: 32,
        borderRadius: 6,
    },
    tinyName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4B5563',
    },
    tinyQty: {
        fontSize: 11,
        color: '#9CA3AF',
    },
});

export default CheckoutScreen;
