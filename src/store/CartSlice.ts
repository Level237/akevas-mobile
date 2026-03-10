import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Structure d'un item dans le panier
export interface CartItem {
    id: number;          // ID du produit
    shop_id: number;     // ID de la boutique (utile pour commander)
    name: string;
    price: number;
    image: string;
    quantity: number;
    // Tu peux ajouter 'variant' (taille/couleur) ici si besoin
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Ajouter au panier
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const existingItem = state.items.find((item) => item.id === action.payload.id);

            if (existingItem) {
                // Si le produit est déjà là, on augmente la quantité
                existingItem.quantity += 1;
            } else {
                // Sinon on l'ajoute avec quantité 1
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },

        // Retirer du panier
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },

        // Incrémenter quantité (+1)
        incrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },

        // Décrémenter quantité (-1)
        decrementQuantity: (state, action: PayloadAction<number>) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                if (item.quantity === 1) {
                    // Si quantité 1, on retire l'item
                    state.items = state.items.filter((i) => i.id !== action.payload);
                } else {
                    item.quantity -= 1;
                }
            }
        },

        // Vider le panier (après commande réussie)
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

// --- SELECTEURS (Calculs automatiques) ---

// 1. Liste des items
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

// 2. Nombre total d'articles (pour le badge du header)
export const selectCartTotalItems = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

// 3. Prix total du panier
export const selectCartTotalPrice = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;