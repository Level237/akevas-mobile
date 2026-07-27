import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Product } from '@/types/product';
import WishlistItem from './WishlistItem';

type Props = {
    items: Product[];
    onRemove: (item: Product) => void;
    onAddToCart: (item: Product) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const WishlistGrid = ({ items, onRemove, onAddToCart, ListHeaderComponent, ListFooterComponent }: Props) => {
    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.id}
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
