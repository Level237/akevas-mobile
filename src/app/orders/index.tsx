import OrderScreen from "@/features/orders/screens/OrderScreen";
import { StyleSheet, View } from "react-native";


export default function Order() {

    return <View style={styles.container}>
        <OrderScreen />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});