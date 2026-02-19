import { COLORS } from "@/constants/colors";
import { ShoppingCart } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Cart = () => {
    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <View>
                <ShoppingCart size={24} color={COLORS.iconLight} />
                <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>2</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        padding: 2,
        marginRight: 8,
    },
    cartBadge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: COLORS.background,
    },
    cartBadgeText: {
        color: COLORS.background,
        fontSize: 10,
        fontWeight: 'bold',
    },
})

export default Cart;