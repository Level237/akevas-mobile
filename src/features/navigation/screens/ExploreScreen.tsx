import { normalizeProduct } from '@/lib/normalizeProduct';
import { useGetCategoriesWithParentIdNullQuery, useGetCategoryProductsByUrlQuery } from '@/services/guardService';
import { Product } from '@/types/product';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryChips from '../../../components/common/CategoryChips';
import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreProductCard from '../components/explore/ExploreProductCard';
import { ExploreProduct } from '../types';


const MOCK_PRODUCTS: ExploreProduct[] = [
    { id: '1', title: 'Montre Luxe Akevas', price: 55000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '2', title: 'Sac à main Cuir', price: 35000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: true },
    { id: '3', title: 'Chaussures Sport', price: 25000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '4', title: 'Casque Sans-fil', price: 45000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '5', title: 'Veste Élégante', price: 65000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '6', title: 'Lunettes Soleil', price: 15000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
];

const ExploreScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedCategoryId, setSelectedCategoryId] = useState('1');
    const [selectedCategoryUrl, setSelectedCategoryUrl] = useState('vetements');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentGenderId, setCurrentGenderId] = useState<number>(0)
    const [page, setPage] = useState(1);
    const {
        data: { data: categoriesParent } = {},
        isLoading
    } = useGetCategoriesWithParentIdNullQuery(currentGenderId, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: true
    });

    const { data: productCategory, isLoading: isLoadingProducts } = useGetCategoryProductsByUrlQuery({
        url: selectedCategoryUrl as string,
        page: page,
        min_price: 0,
        max_price: 0,
        colors: [],
        attribut: [],
    });
    console.log(selectedCategoryUrl)
    const normalizedProducts = products?.map(normalizeProduct);
    //console.log(categoryData)
    const handleBack = () => router.back();

    const handleToggleFavorite = (id: string) => {
        //setProducts(prev => prev.map(p =>
        //p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        //));
    };

    useEffect(() => {
        if (productCategory?.productList) {
            if (page === 1) {
                setProducts(productCategory.productList);
            } else {
                const existingIds = new Set(products.map(product => product.id));

                const newUniqueShops = productCategory.productList.filter((product: Product) => !existingIds.has(product.id));

                setProducts((prevShops) => [...prevShops, ...newUniqueShops]);

                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }
    }, [productCategory, page]);

    const handleProductPress = (product: Product) => {
        // En "Push" (nouvelle page par-dessus)
        router.push({
            pathname: '/(navigation)/category',
            params: { title: product.product_name }
        });
    };

    if (isLoading) return <ActivityIndicator color="#E67E22" />

    const categories = categoriesParent?.map((category: any) => ({
        id: category.id.toString(),
        label: category.category_name,
        url: category.category_url
    })) || [];
    const renderHeader = () => (
        <View style={styles.listHeader}>
            <CategoryChips
                categories={categories}
                selectedUrl={selectedCategoryUrl}
                selectedId={selectedCategoryId}
                onSelect={(id, url) => {
                    setSelectedCategoryId(id);
                    setSelectedCategoryUrl(url);
                    setPage(1);
                }}
            />
        </View>
    );

    const renderFooter = () => {
        if (!loading) return <View style={{ height: 40 }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator color="#E67E22" />
            </View>
        );
    };

    const handleLoadMore = () => {

        if (isLoadingProducts || loading) return;
        if (productCategory && productCategory.totalPagesResponse && page >= productCategory.totalPagesResponse) return;

        setLoading(true);

        setTimeout(() => {
            setPage((prev) => prev + 1);
        }, 600);

    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.safeArea}>
                <ExploreHeader onBack={handleBack} />
                <FlatList
                    data={normalizedProducts}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <ExploreProductCard
                            product={item}
                            onPress={handleProductPress}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                    stickyHeaderIndices={[0]} // Pas possible de sticky CategoryChips si c'est part du ListHeaderComponent avec numColumns
                // Mais on peut envelopper ExploreHeader et CategoryChips dans un conteneur fixe en dehors de FlatList pour un vrai sticky
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    safeArea: {
        flex: 1,
    },
    listHeader: {
        backgroundColor: '#FFF',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default ExploreScreen;
