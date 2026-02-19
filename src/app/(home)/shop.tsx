import { ShopScreen } from "@/features/shop";
import { View } from "react-native";

export default function Shop() {
    return (
        <View style={styles.container}>
            <ShopScreen />
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    }
}