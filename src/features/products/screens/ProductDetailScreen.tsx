import { COLORS } from '@/constants/colors';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useGetProductByUrlQuery } from '@/services/guardService';
import { addItem, selectCartItems } from '@/store/CartSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CheckoutDrawer from '../components/ProductDetail/CheckoutDrawer';
import ImageGallery from '../components/ProductDetail/ImageGallery';
import ProductActionButton from '../components/ProductDetail/ProductActionButton';
import ProductInfo from '../components/ProductDetail/ProductInfo';
import ProductTabs from '../components/ProductDetail/ProductTabs';
import VariationSelector from '../components/ProductDetail/VariationSelector';

type Props = {
    url: string;
};

const ProductDetailScreen = ({ url }: Props) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'buy' | 'cart'>('buy');
    const { data: { data: product } = {}, isLoading, error } = useGetProductByUrlQuery(url);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);


    const handleBuyNow = useCallback(() => {
        setDrawerMode('buy');
        setIsDrawerOpen(true);
    }, []);

    const handleAddToCartDrawer = useCallback(() => {
        setDrawerMode('cart');
        setIsDrawerOpen(true);
    }, []);

    const handleProceedCheckout = useCallback(() => {
        setIsDrawerOpen(false);
        // Navigation already handled inside CheckoutDrawer for 'buy' mode
    }, []);

    const [selectedAttribute, setSelectedAttribute] = useState<any>(null);

    useEffect(() => {
        if (product?.variations && product.variations.length > 0 && !selectedVariant) {
            const firstVariation = product.variations[0];
            setSelectedVariant(firstVariation);
            // Si la variation a des attributs, sélectionner le premier
            if (firstVariation.attributes && firstVariation.attributes.length > 0) {
                setSelectedAttribute(firstVariation.attributes[0]);
            }
            setSelectedImage(0);
        }
    }, [product, selectedVariant]);
    const getAllImages = () => {
        if (selectedVariant) {

            // Si une variante est sélectionnée, retourner toutes ses images
            return selectedVariant.images?.map((path: any) => ({ path })) || [];
        }
        // Sinon, retourner les images du produit principal
        const mainImage = { path: product?.product_profile };
        const productImages = product?.product_images || [];
        return [mainImage, ...productImages];
    };

    const allImages = getAllImages();
    const currentImage = allImages[selectedImage];
    const getSelectedAttribute = useCallback(() => {
        if (selectedVariant?.attributes && selectedVariant.attributes.length > 0) {
            return (
                selectedVariant.attributes.find((attr: any) => attr.value === selectedAttribute?.value) ||
                selectedVariant.attributes[0]
            );
        }
        return null;
    }, [selectedVariant, selectedAttribute]);

    const getCurrentProductInfo = () => {
        if (product?.variations && product.variations.length > 0) {
            const currentVariant = selectedVariant || product.variations[0];

            // Cas où la variation a des attributs
            if (currentVariant.attributes && currentVariant.attributes.length > 0) {
                const selectedAttr = currentVariant.attributes.find((attr: any) => attr.value === selectedAttribute?.value)
                    || currentVariant.attributes[0];

                // Calculer le prix en gros si applicable
                let finalPrice = selectedAttr.price;
                let wholesaleInfo = null;

                if (product.productWholeSales && product.productWholeSales.length > 0) {
                    // Prix de gros au niveau produit (pour produits simples ou variations couleur uniquement)
                    const sortedWholesale = Array.from(product.productWholeSales).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));
                    for (const wholesale of sortedWholesale as any[]) {
                        if (quantity >= Number(wholesale.min_quantity)) {
                            finalPrice = Number(wholesale.wholesale_price);
                            wholesaleInfo = wholesale;
                            break;
                        }
                    }
                } else if (selectedAttr.wholesale_prices && selectedAttr.wholesale_prices.length > 0) {
                    // Prix de gros au niveau attribut (pour produits variés couleur + attribut)
                    const sortedAttrWholesale = Array.from(selectedAttr.wholesale_prices).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));
                    for (const wholesale of sortedAttrWholesale as any[]) {
                        if (quantity >= Number(wholesale.min_quantity)) {
                            finalPrice = Number(wholesale.wholesale_price);
                            wholesaleInfo = wholesale;
                            break;
                        }
                    }
                }

                return {
                    attributeVariationId: selectedAttr.id || 0,
                    productVariationId: currentVariant.id || 0,
                    price: finalPrice,
                    quantity: selectedAttr.quantity,
                    mainImage: currentVariant.images?.[0],
                    images: currentVariant.images?.map((path: string) => ({ path })) || [],
                    color: currentVariant.color,
                    variantName: currentVariant.color.name,
                    attribute: selectedAttr.value,
                    label: selectedAttr.label,
                    wholesaleInfo,
                    originalPrice: selectedAttr.price,
                    group: selectedAttr.group || null
                };
            }

            // Cas où la variation est simple (couleur uniquement)
            let finalPrice = currentVariant.price;
            let wholesaleInfo = null;

            if (product.productWholeSales && product.productWholeSales.length > 0) {
                // Prix de gros au niveau produit pour variations couleur uniquement
                const sortedWholesale = Array.from(product.productWholeSales).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));
                for (const wholesale of sortedWholesale as any[]) {
                    if (quantity >= Number(wholesale.min_quantity)) {
                        finalPrice = Number(wholesale.wholesale_price);
                        wholesaleInfo = wholesale;
                        break;
                    }
                }
            }

            return {
                attributeVariationId: null,
                productVariationId: currentVariant.id || 0,
                price: finalPrice,
                quantity: currentVariant.quantity,
                mainImage: currentVariant.images?.[0],
                images: currentVariant.images?.map((path: string) => ({ path })) || [],
                color: currentVariant.color,
                variantName: currentVariant.color.name,
                attribute: null,
                wholesaleInfo,
                originalPrice: currentVariant.price,
                group: null
            };
        }

        // Si le produit n'a pas de variations
        let finalPrice = product?.product_price;
        let wholesaleInfo = null;

        if (product?.productWholeSales && product.productWholeSales.length > 0) {
            const sortedWholesale = Array.from(product.productWholeSales).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));

            for (const wholesale of sortedWholesale as any[]) {
                if (quantity >= Number(wholesale.min_quantity)) {
                    finalPrice = Number(wholesale.wholesale_price);
                    wholesaleInfo = wholesale;
                    break;
                }
            }
        }

        return {
            attributeVariationId: null,
            productVariationId: null,
            price: finalPrice,
            quantity: product?.product_quantity,
            mainImage: product?.product_profile,
            images: product?.product_images || [],
            color: null,
            variantName: null,
            attribute: null,
            wholesaleInfo,
            originalPrice: product?.product_price,
            group: null
        };
    };

    const currentInfo = getCurrentProductInfo();

    const handleAddToCart = useCallback((qty: number) => {
        const variation = currentInfo.attributeVariationId || currentInfo.productVariationId ? {
            id: currentInfo.productVariationId,
            color: currentInfo.color,
            price: currentInfo.price,
            attributes: currentInfo.attributeVariationId ? {
                id: currentInfo.attributeVariationId,
                value: currentInfo.attribute,
                quantity: currentInfo.quantity,
                price: currentInfo.price
            } : undefined
        } : undefined;

        dispatch(addItem({
            product,
            quantity: qty,
            selectedVariation: variation
        }));

        setIsDrawerOpen(false);
        Toast.show({
            type: 'success',
            text1: 'Ajouté au panier',
            text2: `${qty} x ${product.product_name} ajouté avec succès.`,
            visibilityTime: 2000,
        autoHide: true,
            position: 'top',
        });
    }, [product, currentInfo, dispatch]);

    const productImages = useMemo(() => {
        if (!product) return [];
        const images = [product.product_profile];
        if (product.product_images) {
            product.product_images.forEach((img: any) => images.push(img.path));
        }
        return images;
    }, [product]);
    const handleVariantSelect = useMemo(() => (variant: any) => {
        setSelectedVariant(variant);
        // Réinitialiser l'attribut sélectionné avec le premier de la nouvelle variante
        if (variant.attributes && variant.attributes.length > 0) {
            setSelectedAttribute(variant.attributes[0]);
        } else {
            setSelectedAttribute(null);
        }
        setSelectedImage(0);

    }, []);

    const handleAttributeSelect = (attr: any) => {
        setSelectedAttribute(attr);
    };


    const getWholesaleSource = useCallback(() => {
        if (product?.productWholeSales && product.productWholeSales.length > 0) {
            return Array.from(product.productWholeSales as any[]);
        }
        const attr = getSelectedAttribute();
        if (attr?.wholesale_prices && attr.wholesale_prices.length > 0) {
            return Array.from(attr.wholesale_prices as any[]);
        }
        return [] as any[];
    }, [product, selectedVariant, selectedAttribute]);

    const getMinWholesaleQty = useCallback(() => {
        const source = getWholesaleSource();
        if (!source || source.length === 0) return null;
        return source
            .map((w: any) => Number(w.min_quantity))
            .reduce((min: number, q: number) => (min === 0 ? q : Math.min(min, q)), 0);
    }, [getWholesaleSource]);

    const isWholesaleBlocked = useCallback(() => {
        if (!product?.is_only_wholesale) return false;
        const minQty = getMinWholesaleQty();
        if (!minQty) return false;

        const availableStock = currentInfo.quantity || 0;
        if (availableStock < Number(minQty)) return true;

        return quantity < Number(minQty);
    }, [product, getMinWholesaleQty, quantity]);

    useEffect(() => {
        if (!product?.is_only_wholesale) return;
        const minQty = getMinWholesaleQty();
        if (minQty && quantity < Number(minQty)) {
            setQuantity(Number(minQty));
        }
    }, [product, selectedVariant, selectedAttribute, getMinWholesaleQty]);

    const navigateImage = (direction: 'next' | 'prev') => {
        const allImages = getAllImages();
        if (direction === 'next') {
            setSelectedImage((prev: number) => (prev === allImages.length - 1 ? 0 : prev + 1));
        } else {
            setSelectedImage((prev: number) => (prev === 0 ? allImages.length - 1 : prev - 1));
        }
    };

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
                <ImageGallery images={getAllImages()} />

                <ProductInfo
                    name={product.product_name}
                    price={currentInfo.price}
                    originalPrice={currentInfo.originalPrice}
                    quantity={currentInfo.quantity}
                    rating={product.review_average}
                    reviewCount={product.reviewCount}
                    shopName={product.shop_key}
                    isWholesaleOnly={product.is_only_wholesale}
                    wholesaleTiers={getWholesaleSource()}
                    activeWholesale={currentInfo.wholesaleInfo}
                />

                <VariationSelector
                    variants={product.variations}
                    onVariantChange={handleVariantSelect}
                    handleAttributeSelect={handleAttributeSelect}
                />



                <ProductTabs
                    description={product.product_description}
                    reviews={product.product_reviews}
                    reviewCount={product.reviewCount}
                    rating={product.review_average}
                />
            </ScrollView>

            <ProductActionButton
                price={currentInfo.price}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCartDrawer}
                isDisabled={isWholesaleBlocked()}
                quantity={quantity}
                onQuantityChange={setQuantity}
                minQuantity={product.is_only_wholesale ? (getMinWholesaleQty() || 1) : 1}
            />

            <CheckoutDrawer
                isVisible={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                product={product}
                currentInfo={currentInfo}
                quantity={quantity}
                onQuantityChange={setQuantity}
                minQuantity={product.is_only_wholesale ? (getMinWholesaleQty() || 1) : 1}
                onProceed={handleProceedCheckout}
                onAddToCart={handleAddToCart}
                mode={drawerMode}
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
        backgroundColor: COLORS.primary,
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
