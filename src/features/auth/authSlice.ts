import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: number;
    name: string;
    phone_number: string;
    role_id: number;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action pour connecter l'utilisateur (Login)
        setCredentials: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },

        // Action pour mettre à jour le profil (ex: changer l'avatar)
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },

        // Action pour déconnecter (Logout)
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

// Selectors pour récupérer les données facilement
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

export default authSlice.reducer;