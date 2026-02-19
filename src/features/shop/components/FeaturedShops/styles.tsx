import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width * 0.8;
export const CARD_MARGIN = 12;
export const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6b0f1a', // Dark burgundy/red from image
        paddingVertical: 30,
        width: '100%',
    },
    listContent: {
        paddingHorizontal: (width - CARD_WIDTH) / 2 - CARD_MARGIN,
        alignItems: 'center',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        gap: 20,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    viewAllText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
});
