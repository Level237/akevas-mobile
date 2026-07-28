import { FavoriteItem } from '@/store/FavoriteSlice';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import WishlistItem from './WishlistItem';

type Props = {
    items: FavoriteItem[];
    onRemove: (item: FavoriteItem) => void;
    onAddToCart: (item: FavoriteItem) => void;
    onPress?: (item: FavoriteItem) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const WishlistGrid = ({ items, onRemove, onAddToCart, onPress, ListHeaderComponent, ListFooterComponent }: Props) => {

    return (
        <FlatList
            data={items}
            keyExtractor={(item: any) => item.product?.id || item.id || Math.random().toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            renderItem={({ item }) => (
                <WishlistItem
                    item={item}
                    onRemove={onRemove}
                    onAddToCart={onAddToCart}
                    onPress={onPress}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default WishlistGrid;
