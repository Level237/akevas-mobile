import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface SearchItem {
    id: string;
    search_term: string;
    created_at: string;
}

interface SearchState {
    recentSearches: SearchItem[];
}

const initialState: SearchState = {
    recentSearches: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addSearch: (state, action: PayloadAction<string>) => {
            const term = action.payload.trim();
            if (!term) return;
            
            // Remove if already exists to move to top
            state.recentSearches = state.recentSearches.filter(
                (item) => item.search_term.toLowerCase() !== term.toLowerCase()
            );
            
            // Add to top
            state.recentSearches.unshift({
                id: Date.now().toString(),
                search_term: term,
                created_at: new Date().toISOString(),
            });
            
            // Keep only last 10
            if (state.recentSearches.length > 10) {
                state.recentSearches = state.recentSearches.slice(0, 10);
            }
        },
        removeSearch: (state, action: PayloadAction<string>) => {
            state.recentSearches = state.recentSearches.filter(
                (item) => item.id !== action.payload
            );
        },
        clearSearches: (state) => {
            state.recentSearches = [];
        },
    },
});

export const { addSearch, removeSearch, clearSearches } = searchSlice.actions;

export const selectRecentSearches = (state: RootState) => state.search.recentSearches;

export default searchSlice;
