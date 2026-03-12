import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from './baseQuery';


const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    timeout: 45000,
    prepareHeaders: async (headers) => {
        let token = null;
        try {
            token = await SecureStore.getItemAsync('access_token');
        } catch (e) {
            console.log("Erreur lecture token");
        }
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {

    // 3. Exécuter la requête
    const result = await rawBaseQuery(args, api, extraOptions);

    // 4. Gérer l'erreur 401 (Token expiré)
    if (result.error && result.error.status === 401) {
        // Logique de logout ici
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        // api.dispatch(logoutAction());
        console.log("Token expiré, déconnexion...");
    }

    return result;
};

export default baseQueryWithAuth;