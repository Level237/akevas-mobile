import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const GENDERS = ['Homme', 'Femme', 'Enfant'];
const ACCENT_COLOR = '#E67E22'; // Orange requested

type Props = {
    animatedStyle: any;
};

const GenderHeader = ({ animatedStyle }: Props) => {
    const [selected, setSelected] = useState('Homme');
    const insets = useSafeAreaInsets();
    const HEADER_HEIGHT = 60; // Content height of HomeHeader

    return (
        <Animated.View style={[
            styles.container,
            { top: insets.top + HEADER_HEIGHT },
            animatedStyle
        ]}>
            <View style={styles.content}>
                {GENDERS.map((gender) => (
                    <TouchableOpacity
                        key={gender}
                        onPress={() => setSelected(gender)}
                        activeOpacity={0.7}
                        style={styles.genderItem}
                    >
                        <Text
                            style={[
                                styles.genderText,
                                selected === gender && styles.selectedText,
                            ]}
                        >
                            {gender}
                        </Text>
                        {selected === gender && (
                            <View style={styles.activeIndicator} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: '#FFFFFF',
        zIndex: 90,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    genderItem: {
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    genderText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8e8e93', // Grey text
    },
    selectedText: {
        color: '#1c1c1e', // Darker text for selected
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: ACCENT_COLOR,
    },
});

export default GenderHeader;