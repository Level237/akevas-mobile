import { FlatList, StyleSheet, Text, View } from "react-native";
import SuggestedShopItem from "./SuggestedShopItem";


import { Shop } from "@/types/seller";

type Props = {
    shops: Shop[];
};

const RenderSuggestedShops = ({ shops }: Props) => (
    <View style={styles.suggestedContainer}>
        <Text style={styles.sectionTitle}>Suggestions pour vous</Text>
        <FlatList
            horizontal
            data={shops?.slice(0, 10)}
            keyExtractor={(item: any) => `suggested-${item.shop_id}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <SuggestedShopItem shop={item} />}
            contentContainerStyle={styles.suggestedList}
        />
    </View>
);


const styles = StyleSheet.create({
    suggestedContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    suggestedList: {
        paddingHorizontal: 20,
    },

});

export default RenderSuggestedShops;