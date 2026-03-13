
import HeaderTabs from '@/components/common/HeaderTabs';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { removeItem, selectCartItems, selectCartTotalPrice, updateQuantity } from '@/store/CartSlice';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import CartItem from '../components/CartItem';
import EmptyCart from '../components/EmptyCart';
import OrderSummary from '../components/OrderSummary';
import { CartItemType } from '../types';

const MOCK_CART_ITEMS: CartItemType[] = [
    {
        id: '1',
        title: 'Montre sorou versions orignal',
        price: 55000,
        image: require('@/assets/images/shop1.webp'),
        location: 'Douala',
        quantity: 1,
    },
];

const CartPage = () => {

    const dispatch = useAppDispatch()

    const cartItems = useAppSelector(selectCartItems)

    const totalPrice = useAppSelector(selectCartTotalPrice);
    const isEmpty = cartItems.length === 0;

    const deliveryFee = isEmpty ? 0 : 5000;
    const total = totalPrice + deliveryFee;

    const handleIncrease = (item: any) => {

        dispatch(updateQuantity({
            product: item.product,
            quantity: item.quantity + 1,
            selectedVariation: item.selectedVariation
        }));
    };

    const handleDecrease = (item: any) => {
        console.log("lelelelelelhdh")
        console.log(item)
        if (item.quantity > 1) {
            dispatch(updateQuantity({
                product: item,
                quantity: item.quantity - 1,
                selectedVariation: item.selectedVariation
            }));
        } else {
            // Si quantité est 1, on demande confirmation pour supprimer
            handleRemoveItem(item);
        }
    };

    const handleRemoveItem = (item: any) => {
        Alert.alert(
            "Supprimer l'article",
            "Voulez-vous vraiment retirer cet article de votre panier ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => dispatch(removeItem({
                        product: item.product,
                        selectedVariation: item.selectedVariation
                    }))
                }
            ]
        );

    };

    const handleCheckout = () => {
        console.log('Proceeding to checkout with total:', total);
    };

    return (
        <View style={styles.container}>
            <HeaderTabs title="Panier" />

            {isEmpty ? (
                <EmptyCart />
            ) : (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Cart Items List */}
                        <View style={styles.section}>
                            {cartItems.map(item => (
                                <CartItem
                                    key={item.product.id}
                                    item={item}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </View>
                    </ScrollView>

                    {/* Summary Footer */}
                    <OrderSummary
                        subtotal={totalPrice}
                        deliveryFee={deliveryFee}
                        total={totalPrice + deliveryFee}
                        onCheckout={handleCheckout}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 8,
    },
});

export default CartPage;
