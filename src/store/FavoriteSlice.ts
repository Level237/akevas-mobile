import { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteState {
    favoriteItems: Product[];
}

const initialState: FavoriteState = {
    favoriteItems: [],
};

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const existingItem = state.favoriteItems.find(item => item.id === product.id);

            if (!existingItem) {
                state.favoriteItems.push(product);
            }
        },
        removeFavorite: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            state.favoriteItems = state.favoriteItems.filter(item => item.id !== product.id);
        },
        toggleFavorite: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const existingItem = state.favoriteItems.find(item => item.id === product.id);

            if (existingItem) {
                state.favoriteItems = state.favoriteItems.filter(item => item.id !== product.id);
            } else {
                state.favoriteItems.push(product);
            }
        },
        clearFavorites: (state) => {
            state.favoriteItems = [];
        }
    }
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoriteSlice.actions;

export const selectFavoriteItems = (state: { favorite: FavoriteState }) => state.favorite.favoriteItems;
export const selectIsFavorite = (productId: number | string) => (state: { favorite: FavoriteState }) => 
    state.favorite.favoriteItems.some(item => item.id === productId);

export default favoriteSlice;
