
import Cart from "@/components/common/Cart";
import SearchResource from "@/components/common/Search";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HeaderWishlist = ({ itemsLength }: { itemsLength: number }) => {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Mes Coups de Cœur</Text>
                <Text style={styles.itemCount}>{itemsLength} articles</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIcon}>
                    <SearchResource />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerIcon}
                    onPress={() => router.push('/(home)/cart')}
                >
                    <Cart />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    itemCount: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default HeaderWishlist;