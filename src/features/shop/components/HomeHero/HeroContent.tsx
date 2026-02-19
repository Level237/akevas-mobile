import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInRight,
    FadeOutLeft,
    Layout
} from 'react-native-reanimated';

const HERO_DATA = [
    {
        title: 'Découvrez Notre Marketplace',
        description: 'Des milliers de produits  à portée de clic',
    },
    {
        title: 'Devenir vendeur',
        description: 'Boostez votre business local en quelques clics',
    },
    {
        title: 'Livraison Express',
        description: 'Recevez vos pépites directement chez vous',
    },
];

type Props = {
    activeIndex: number;
};

const HeroContent = ({ activeIndex }: Props) => {
    const content = HERO_DATA[activeIndex];

    return (
        <View style={styles.container}>
            <Animated.View
                key={activeIndex}
                entering={FadeInRight.duration(800)}
                exiting={FadeOutLeft.duration(800)}
                layout={Layout.springify()}
                style={styles.animatedContainer}
            >
                <Text style={styles.title}>{content.title}</Text>
                <Text style={styles.description}>{content.description}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    animatedContainer: {

    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'left',
        paddingHorizontal: 10,
        lineHeight: 42,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'left',
        paddingHorizontal: 10,
    },
});

export default HeroContent;
