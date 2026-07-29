import CheckoutScreen from '@/features/checkout/screens/CheckoutScreen';
import { useLocalSearchParams } from 'expo-router';

const CheckoutIndex = () => {
    const params = useLocalSearchParams();

    // On s'assure que s est un nombre ou une chaîne cohérente
    const s = params.s;

    // Si s == 0, on est en achat direct
    return <CheckoutScreen params={params} />;
};

export default CheckoutIndex;
