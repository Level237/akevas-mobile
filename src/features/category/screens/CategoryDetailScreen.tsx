import ProductCard from '@/components/ProductCard';
import { normalizeProduct } from '@/lib/normalizeProduct';
import { useGetCategoryProductsByUrlQuery } from '@/services/guardService';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type Props = {
    url: string;
    name: string;
    image: string;
    description?: string;
};

// Mock subcategories for UI layout matching the provided design
const MOCK_SUBCATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'shoes', name: 'Shoes' },
    { id: 'hats', name: 'Hats' },
    { id: 'bags', name: 'Bags' },
];

export default function CategoryDetailScreen({ url, name, image, description }: Props) {
    const insets = useSafeAreaInsets();
    const [activeSubcategory, setActiveSubcategory] = useState('all');

    // Fetch products using the endpoint
    const { data, isLoading } = useGetCategoryProductsByUrlQuery({ url });

    const products = data?.productList || [];
    const normalizedProducts = useMemo(() => products?.map(normalizeProduct), [products]);

    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            opacity.stopAnimation();
        }
    }, [isLoading, opacity]);

    const handleBack = () => {
        router.back();
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Hero Image */}
            <View style={{ height: height * 0.42 }}>
                <Image
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={styles.heroImage}
                    contentFit="cover"
                />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.15)' }]} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.gradient}
                />

                {/* Back Button */}
                <TouchableOpacity
                    style={[styles.backButton, { top: insets.top + 10 }]}
                    onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Text Overlay */}
                <View style={styles.heroTextContainer}>
                    <Text style={styles.heroTitle}>{name}</Text>
                    {description && (
                        <Text style={styles.heroDescription} numberOfLines={2}>
                            {description}
                        </Text>
                    )}

                </View>
            </View>

            {/* Subcategories Filter ScrollView */}
            <View style={styles.filtersContainer}>
                {isLoading ? (
                    <View style={styles.filtersListSkeleton}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Animated.View key={i} style={[styles.filterChipSkeleton, { opacity }]} />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={MOCK_SUBCATEGORIES}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersList}
                        renderItem={({ item }) => {
                            const isActive = activeSubcategory === item.id;
                            return (
                                <TouchableOpacity
                                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                                    onPress={() => setActiveSubcategory(item.id)}
                                >
                                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
            </View>

            {/* Products Title */}
            {isLoading ? (
                <View style={styles.sectionHeader}>
                    <Animated.View style={[styles.sectionTitleSkeleton, { opacity }]} />
                </View>
            ) : normalizedProducts.length > 0 && (
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {activeSubcategory === 'all' ? 'Tous les articles' : MOCK_SUBCATEGORIES.find(s => s.id === activeSubcategory)?.name}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={normalizedProducts}
                keyExtractor={(item: any) => item.id}
                numColumns={2}
                ListHeaderComponent={renderHeader}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    isLoading ? (
                        <View style={styles.productsGridSkeleton}>
                            {[1, 2, 3, 4].map((item) => (
                                <View key={item} style={styles.productCardSkeleton}>
                                    <Animated.View style={[styles.productImageSkeleton, { opacity }]} />
                                    <Animated.View style={[styles.productTitleSkeleton, { opacity }]} />
                                    <Animated.View style={[styles.productPriceSkeleton, { opacity }]} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Aucun produit trouvé dans cette catégorie.</Text>
                        </View>
                    )
                )}
                renderItem={({ item }) => (
                    <ProductCard product={item} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        backgroundColor: '#F9FAFB',
        marginBottom: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    heroTextContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    heroTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: -1,
    },
    heroDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 20,
        lineHeight: 22,
    },
    shopNowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 6,
    },
    shopNowText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    filtersContainer: {
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    filtersList: {
        paddingHorizontal: 15,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    filterChipActive: {
        backgroundColor: '#FFF',
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#111827',
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContent: {
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    filtersListSkeleton: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 10,
    },
    filterChipSkeleton: {
        width: 80,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    sectionTitleSkeleton: {
        width: 150,
        height: 20,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    productsGridSkeleton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    productCardSkeleton: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    productImageSkeleton: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 10,
    },
    productTitleSkeleton: {
        height: 14,
        width: '80%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 6,
    },
    productPriceSkeleton: {
        height: 16,
        width: '50%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
});
