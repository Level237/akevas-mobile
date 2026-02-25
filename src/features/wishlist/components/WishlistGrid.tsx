import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { WishlistItemType } from '../types';
import WishlistItem from './WishlistItem';

type Props = {
    items: WishlistItemType[];
    onRemove: (id: string) => void;
    onAddToCart: (item: WishlistItemType) => void;
};

const WishlistGrid = ({ items, onRemove, onAddToCart }: Props) => {
    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
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
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default WishlistGrid;
