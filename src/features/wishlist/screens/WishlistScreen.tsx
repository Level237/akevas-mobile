import HeaderSetting from '@/components/common/HeaderSetting';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WishlistGrid from '../components/WishlistGrid';
import { WishlistItemType } from '../types';

const MOCK_WISH_ITEMS: WishlistItemType[] = [
    {
        id: '1',
        title: 'Montre Luxe Akevas',
        price: 55000,
        imageUrl: require('@/assets/images/shop1.webp'),
    },
    {
        id: '2',
        title: 'Sac de sport Premium',
        price: 32000,
        imageUrl: require('@/assets/images/shop1.webp'),
    },
    {
        id: '3',
        title: 'Casque Wireless',
        price: 45000,
        imageUrl: require('@/assets/images/shop1.webp'),
    },
    {
        id: '4',
        title: 'Lunettes de soleil Designer',
        price: 18000,
        imageUrl: require('@/assets/images/shop1.webp'),
    },
];

const WishlistScreen = () => {
    const [items, setItems] = useState<WishlistItemType[]>(MOCK_WISH_ITEMS);

    const handleRemove = (id: string) => {
        setItems(curr => curr.filter(item => item.id !== id));
    };

    const handleAddToCart = (item: WishlistItemType) => {
        console.log('Added to cart:', item.title);
    };

    return (
        <View style={styles.container}>
            <HeaderSetting title="Favoris" />
            <WishlistGrid
                items={items}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFDFD',
    },
});

export default WishlistScreen;
