
import HeaderTabs from '@/components/common/HeaderTabs';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useRedirectToLogin } from '@/hooks/useRedirectToLogin';
import { removeItem, selectCartItems, selectCartTotalPrice, updateQuantity } from '@/store/CartSlice';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import CartItem from '../components/CartItem';
import EmptyCart from '../components/EmptyCart';
import OrderSummary from '../components/OrderSummary';



const CartPage = () => {

    const dispatch = useAppDispatch()
    const { redirectToLogin } = useRedirectToLogin();
    const router = useRouter()
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
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
        if (cartItems.length === 0) return;

        if (!isAuthenticated) {
            redirectToLogin({
                redirectUrl: '/checkout',
                s: "1"
            });
        } else {
            router.push({
                pathname: '/checkout',
                params: {
                    s: "1"
                }
            });
        }
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
                                    key={item.product.id + item?.selectedVariation?.attributes?.id ? item?.selectedVariation?.attributes?.id : ''}
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
