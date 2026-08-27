
import { Product } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    product: Product;
    quantity: number;
    selectedVariation?: {
        id: number;
        color: {
            id: number;
            name: string;
            hex: string;
        };
        price?: string;
        image?: string;
        attributes?: {
            id: number;
            value: string;
            quantity: number;
            price: string;
        };
    };
}

// Fonctions utilitaires pour les calculs
const getItemPrice = (item: CartItem): number => {
    if (item.selectedVariation) {
        if (item.selectedVariation.attributes?.price) {
            return parseFloat(item.selectedVariation.attributes.price);
        }
        if (item.selectedVariation.price) {
            return parseFloat(item.selectedVariation.price);
        }
    }

    return parseFloat(item.product.product_price);
};

const findCartItem = (cartItems: CartItem[], product: Product, selectedVariation?: any): CartItem | undefined => {
    return cartItems.find(item => {
        if (selectedVariation) {
            // Si la variation a des attributs, comparer par couleur ET valeur d'attribut
            if (selectedVariation.attributes && item.selectedVariation?.attributes) {
                return item.selectedVariation.color.id === selectedVariation.color.id &&
                    item.selectedVariation.attributes.value === selectedVariation.attributes.value;
            }
            // Sinon comparer seulement par couleur
            return item.selectedVariation?.color.id === selectedVariation.color.id;
        }
        // Produit sans variation


        return item.product.id === product.id && !item.selectedVariation;
    });
};

const getMaxQuantity = (product: Product, selectedVariation?: any): number => {
    const stockValue = selectedVariation?.attributes?.quantity ?? selectedVariation?.quantity ?? product?.product_quantity;
    const parsed = Number(stockValue);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : Number.MAX_SAFE_INTEGER;
};

const recalculateTotals = (cartItems: CartItem[]): { totalQuantity: number; totalPrice: number } => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => {
        const price = getItemPrice(item);
        return total + (price * item.quantity);
    }, 0);

    return { totalQuantity, totalPrice };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [] as any[],
        totalQuantity: 0,
        totalPrice: 0
    },
    reducers: {
        addItem: (state, action) => {
            const { product, quantity, selectedVariation } = action.payload;
            const maxQuantity = getMaxQuantity(product, selectedVariation);
            const safeQuantity = Math.min(Math.max(0, Number(quantity) || 0), maxQuantity);

            const existingItem = findCartItem(state.cartItems, product, selectedVariation);

            if (existingItem) {
                const nextQuantity = Math.min(existingItem.quantity + safeQuantity, maxQuantity);
                existingItem.quantity = nextQuantity;
            } else {
                state.cartItems.push({
                    product,
                    quantity: safeQuantity,
                    selectedVariation: selectedVariation || undefined
                });
            }

            const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
            state.totalQuantity = totalQuantity;
            state.totalPrice = totalPrice;
        },

        removeItem: (state, action) => {
            const { product, selectedVariation } = action.payload;

            const itemToRemove = findCartItem(state.cartItems, product, selectedVariation);

            if (itemToRemove) {
                // Retirer l'item du panier
                state.cartItems = state.cartItems.filter(cartItem => cartItem !== itemToRemove);

                // Recalculer les totaux
                const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
                state.totalQuantity = totalQuantity;
                state.totalPrice = totalPrice;

                // Sauvegarder dans localStorage

            }
        },

        updateQuantity: (state, action) => {
            const { product, quantity, selectedVariation } = action.payload;
            const maxQuantity = getMaxQuantity(product, selectedVariation);
            const nextQuantity = Math.min(Math.max(0, Number(quantity) || 0), maxQuantity);

            const item = findCartItem(state.cartItems, product, selectedVariation);
            if (item) {
                if (nextQuantity <= 0) {
                    state.cartItems = state.cartItems.filter(cartItem => cartItem !== item);
                } else {
                    item.quantity = nextQuantity;
                }

                const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
                state.totalQuantity = totalQuantity;
                state.totalPrice = totalPrice;
            }
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },

        // Nouvelle action pour synchroniser avec localStorage

    }
});

export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;

export const selectCartItems = (state: { cart: { cartItems: CartItem[] } }) => state.cart.cartItems;
export const selectCartTotalQuantity = (state: { cart: { totalQuantity: number } }) => state.cart.totalQuantity;
export const selectCartTotalPrice = (state: { cart: { totalPrice: number } }) => state.cart.totalPrice;
export default cartSlice;