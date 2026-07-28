import { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavoriteItem {
    product: Product;
    selectedVariation?: {
        id: number;
        color: {
            id: number;
            name: string;
            hex: string;
        };
        price?: string;
        attributes?: {
            id: number;
            value: string;
            quantity: number;
            price: string;
        };
    };
}

interface FavoriteState {
    favoriteItems: FavoriteItem[];
}

const initialState: FavoriteState = {
    favoriteItems: [],
};

export const findFavoriteItem = (favoriteItems: any[], product: Product, selectedVariation?: any): any | undefined => {
    return favoriteItems.find(item => {
        const itemProduct = item.product || item; // Compatibilité ancienne structure
        const itemVariation = item.selectedVariation;

        if (selectedVariation) {
            if (selectedVariation.attributes && itemVariation?.attributes) {
                return itemVariation.color.id === selectedVariation.color.id &&
                    itemVariation.attributes.value === selectedVariation.attributes.value;
            }
            return itemVariation?.color.id === selectedVariation.color.id;
        }
        return itemProduct.id === product?.id && !itemVariation;
    });
};

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<{ product: Product; selectedVariation?: any }>) => {
            const { product, selectedVariation } = action.payload;
            const existingItem = findFavoriteItem(state.favoriteItems, product, selectedVariation);

            if (!existingItem) {
                state.favoriteItems.push({ product, selectedVariation });
            }
        },
        removeFavorite: (state, action: PayloadAction<{ product: Product; selectedVariation?: any }>) => {
            const { product, selectedVariation } = action.payload;
            const itemToRemove = findFavoriteItem(state.favoriteItems, product, selectedVariation);

            if (itemToRemove) {
                state.favoriteItems = state.favoriteItems.filter(item => item !== itemToRemove);
            }
        },
        toggleFavorite: (state, action: PayloadAction<{ product: Product; selectedVariation?: any }>) => {
            const { product, selectedVariation } = action.payload;
            const existingItem = findFavoriteItem(state.favoriteItems, product, selectedVariation);

            if (existingItem) {
                state.favoriteItems = state.favoriteItems.filter(item => item !== existingItem);
            } else {
                state.favoriteItems.push({ product, selectedVariation });
            }
        },
        clearFavorites: (state) => {
            state.favoriteItems = [];
        }
    }
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoriteSlice.actions;

export const selectFavoriteItems = (state: { favorite: FavoriteState }) => state.favorite.favoriteItems;
export const selectIsFavorite = (product: Product, selectedVariation?: any) => (state: { favorite: FavoriteState }) => {
    return !!findFavoriteItem(state.favorite.favoriteItems, product, selectedVariation);
};

export default favoriteSlice;
