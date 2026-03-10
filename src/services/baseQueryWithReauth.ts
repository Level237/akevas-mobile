import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from './baseQuery';

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {

    // 1. Récupérer le token
    let token = null;
    try {
        token = await SecureStore.getItemAsync('access_token');
    } catch (e) {
        console.log("Erreur lecture token");
    }

    // 2. Préparer les headers avec le token
    const rawBaseQuery = fetchBaseQuery({
        baseUrl,
        timeout: 10000,
        prepareHeaders: (headers) => {
            // Si on a un token, on l'ajoute
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        },
    });

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