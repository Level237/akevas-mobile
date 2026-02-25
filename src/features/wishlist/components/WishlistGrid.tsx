import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { WishlistItemType } from '../types';
import WishlistItem from './WishlistItem';

type Props = {
    items: WishlistItemType[];
    onRemove: (id: string) => void;
    onAddToCart: (item: WishlistItemType) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null; // Ajouté
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null; // Ajouté
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
