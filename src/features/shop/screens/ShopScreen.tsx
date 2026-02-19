import HeaderTabs from '@/components/common/HeaderTabs';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShopHeader from '../components/shopDetail/ShopHeader';

const dummyData = Array.from({ length: 40 }).map((_, i) => ({
    id: i.toString(),
    title: `Boutique ${i + 1}`,
    category: 'Mode & Style',
}));

export default function ShopScreen() {
    const scrollY = useSharedValue(0);
    const insets = useSafeAreaInsets();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Main Content List */}
            <HeaderTabs title='Boutiques' />
            <Animated.FlatList
                data={dummyData}
                keyExtractor={(item) => item.id}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                ListHeaderComponent={() => <ShopHeader scrollY={scrollY} />}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    cardImage: {
        height: 150,
        backgroundColor: '#f8f9fa',
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    cardCategory: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});