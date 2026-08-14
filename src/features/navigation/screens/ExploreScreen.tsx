import { normalizeProduct } from "@/lib/normalizeProduct";
import {
    useGetCategoriesWithParentIdNullQuery,
    useGetCategoryProductsByUrlQuery,
} from "@/services/guardService";
import { Product } from "@/types/product";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategoryChips from "../../../components/common/CategoryChips";
import CategoryFilterModal from "../../category/components/CategoryFilterModal";
import ExploreHeader from "../components/explore/ExploreHeader";
import ExploreProductCard from "../components/explore/ExploreProductCard";

const ExploreScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");
  const [selectedCategoryUrl, setSelectedCategoryUrl] = useState("vetements");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentGenderId, setCurrentGenderId] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<number[]>([]);
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [selectedBulkPriceRange, setSelectedBulkPriceRange] = useState('');
  const { data: { data: categoriesParent } = {}, isLoading } =
    useGetCategoriesWithParentIdNullQuery(currentGenderId, {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: true,
    });

  const { data: productCategory, isLoading: isLoadingProducts } =
    useGetCategoryProductsByUrlQuery({
      url: selectedCategoryUrl as string,
      page: page,
      min_price: minPrice,
      max_price: maxPrice,
      colors: selectedColors,
      attribut: selectedAttributes,
      gender: selectedGenders,
      seller_mode: isSellerMode,
      bulk_price_range: selectedBulkPriceRange
    });

  const normalizedProducts = products?.map(normalizeProduct);
  //console.log(categoryData)
  const handleBack = () => router.back();

  const handleApplyFilters = (filters: any) => {
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setSelectedColors(filters.selectedColors);
    setSelectedAttributes(filters.selectedAttributes);
    setSelectedGenders(filters.selectedGenders);
    setIsSellerMode(filters.isSellerMode);
    setSelectedBulkPriceRange(filters.selectedBulkPriceRange);
    setPage(1);
  };

  const activeFiltersCount = selectedColors.length + selectedAttributes.length + selectedGenders.length + (isSellerMode ? 1 : 0) + (selectedBulkPriceRange ? 1 : 0) + (minPrice > 0 || maxPrice < 500000 ? 1 : 0);

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
        const existingIds = new Set(products.map((product) => product.id));

        const newUniqueShops = productCategory.productList.filter(
          (product: Product) => !existingIds.has(product.id),
        );

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
      pathname: "/(navigation)/category",
      params: { title: product.product_name },
    });
  };

  if (isLoading) return <ActivityIndicator color="#E67E22" />;

  const categories =
    categoriesParent?.map((category: any) => ({
      id: category.id.toString(),
      label: category.category_name,
      url: category.category_url,
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
    if (
      productCategory &&
      productCategory.totalPagesResponse &&
      page >= productCategory.totalPagesResponse
    )
      return;

    setLoading(true);

    setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 600);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.safeArea}>
        <ExploreHeader 
          onBack={handleBack} 
          onFilterPress={() => setIsFilterVisible(true)}
          activeFiltersCount={activeFiltersCount}
        />
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
        <CategoryFilterModal
          visible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          categoryId={Number(selectedCategoryId) || 0}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedColors={selectedColors}
          selectedAttributes={selectedAttributes}
          selectedGenders={selectedGenders}
          isSellerMode={isSellerMode}
          selectedBulkPriceRange={selectedBulkPriceRange}
          onApply={handleApplyFilters}
          onClearAll={() => {
            setMinPrice(0);
            setMaxPrice(500000);
            setSelectedColors([]);
            setSelectedAttributes([]);
            setSelectedGenders([]);
            setIsSellerMode(false);
            setSelectedBulkPriceRange('');
            setPage(1);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  safeArea: {
    flex: 1,
  },
  listHeader: {
    backgroundColor: "#FFF",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default ExploreScreen;
