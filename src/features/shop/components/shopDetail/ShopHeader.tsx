import { useGetHomeShopsQuery } from '@/services/guardService';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import RenderSuggestedShops from '../ShopSearch/ShopSuggested';

type Props = {
    scrollY: SharedValue<number>;
    onPressStory: (shop: any) => void;
};

const ShopHeader = ({ onPressStory }: Props) => {
    const { data: homeShopsData } = useGetHomeShopsQuery(undefined);
    const shops = homeShopsData?.data || [];

    return (
        <Animated.View style={styles.container}>
            {/* horizontal Shop Stories */}
            <View style={styles.storiesWrapper}>
                <RenderSuggestedShops
                    color="#000"
                    shops={shops}
                    onPressStory={onPressStory}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFF',
        paddingBottom: 10,
        paddingTop: 10,
    },
    storiesWrapper: {
        marginTop: 5,
    }
});

export default React.memo(ShopHeader);