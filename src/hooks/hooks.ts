import { AppDispatch, RootState } from '@/store'; // Vérifie bien le chemin vers ton store
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Utilisation des hooks typés pour tout ton application
// Cela te permet d'avoir l'autocomplétion sur le state et le dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;