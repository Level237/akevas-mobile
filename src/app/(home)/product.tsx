import { ProductScreen } from "@/features/products";
import { StyleSheet, View } from "react-native";


export default function Product() {
    return (
        <View style={styles.container}>
            <ProductScreen />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
});