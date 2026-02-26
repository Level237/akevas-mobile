import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';



// Tes services API (RTK Query)

import { guardService } from "@/services/guardService";


// 1. On combine tous les reducers
const rootReducer = combineReducers({

    [guardService.reducerPath]: guardService.reducer,
});

// 2. Configuration de la persistance
const persistConfig = {
    key: 'root',
    storage: AsyncStorage, // Le stockage du téléphone
    whitelist: ['auth', 'cart', 'delivery'], // ⚠️ IMPORTANT : Ne mets PAS tes services API ici ! 
    // On sauvegarde seulement les données critiques (User connecté, contenu du panier).
};

// 3. On crée le reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configuration du Store
export const store = configureStore({
    reducer: persistedReducer, // On utilise le version "persistante" et pas le rootReducer brut
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        // Au lieu de mettre "false", on ignore juste les actions de redux-persist
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }).concat(
        guardService.middleware,
    )
});

// 5. Export du persistor (nécessaire pour App.tsx)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch