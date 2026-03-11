import OrderDetailScreen from "@/features/orders/screens/OrderDetailScreen";
import { useLocalSearchParams } from "expo-router";


export default function OrderDetail() {
    const { id } = useLocalSearchParams();
    return <OrderDetailScreen id={id as string} />;
}