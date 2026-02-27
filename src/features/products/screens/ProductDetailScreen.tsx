import { useGetProductByUrlQuery } from '@/services/guardService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageCarousel from '../components/ProductDetail/ImageCarousel';
import InstallmentPlan from '../components/ProductDetail/InstallmentPlan';
import ProductActionButton from '../components/ProductDetail/ProductActionButton';
import ProductInfo from '../components/ProductDetail/ProductInfo';
import VariationSelector from '../components/ProductDetail/VariationSelector';

type Props = {
    url: string;
};

const ProductDetailScreen = ({ url }: Props) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { data: { data: product } = {}, isLoading, error } = useGetProductByUrlQuery(url);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    const handleBuyNow = useCallback(() => {
        console.log('Buy now:', product?.product_name);
    }, [product]);

    const handleAddToCart = useCallback(() => {
        console.log('Add to cart:', product?.product_name);
    }, [product]);

    const productImages = useMemo(() => {
        if (!product) return [];
        const images = [product.product_profile];
        if (product.product_images) {
            product.product_images.forEach((img: any) => images.push(img.path));
        }
        return images;
    }, [product]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Produit introuvable</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Sticky Placeholder */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                    <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="share-outline" size={22} color="#1A1A1A" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="heart-outline" size={22} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <ImageCarousel images={productImages} />

                <ProductInfo
                    name={product.product_name}
                    price={product.product_price}
                    rating={product.review_average}
                    reviewCount={product.reviewCount}
                    shopName={product.shop_key}
                />

                <VariationSelector
                    variants={product.variations}
                    onVariantChange={setSelectedVariant}
                />

                <View style={styles.section}>
                    <InstallmentPlan price={product.product_price} />
                </View>

                <View style={styles.descriptionSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                        {product.product_description}
                    </Text>
                </View>
            </ScrollView>

            <ProductActionButton
                price={product.product_price}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 20,
    },
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#6366F1',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 10,
        // background handled via scroll transition usually, here simplified
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    section: {
        paddingHorizontal: 15,
    },
    descriptionSection: {
        padding: 20,
        borderTopWidth: 8,
        borderTopColor: '#F9FAFB',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    descriptionText: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
    },
});

export default ProductDetailScreen;
