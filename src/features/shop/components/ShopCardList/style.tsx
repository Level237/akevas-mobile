import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const THEME = {
    primary: '#E67E22', // Orange Akevas
    secondary: '#5D1C1C', // Bordeaux Akevas
    background: '#F8F8F8', // Gris Fond
    text: '#1A1A1A',
    textSecondary: '#666666', // Gris Texte
    white: '#FFFFFF',
    border: '#EEEEEE',
    shadow: '#000000',
    star: '#FFC107',
};

export const styles = StyleSheet.create({
    // ShopCardCompact Styles
    compactContainer: {
        flexDirection: 'row',
        height: 120,
        backgroundColor: THEME.white,
        borderRadius: 15,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 10,
        alignItems: 'center',
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    compactImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: THEME.background,
    },
    compactContent: {
        flex: 1,
        marginLeft: 15,
        height: '100%',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    compactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    compactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: THEME.text,
        marginRight: 6,
    },
    compactRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    compactRatingText: {
        fontSize: 13,
        color: THEME.textSecondary,
        marginLeft: 4,
    },
    compactLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    compactLocationText: {
        fontSize: 12,
        color: THEME.textSecondary,
        marginLeft: 4,
    },
    compactFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    compactTagsRow: {
        flexDirection: 'row',
        gap: 6,
    },
    tagChip: {
        backgroundColor: THEME.secondary, // Bordeaux
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    tagText: {
        color: THEME.white,
        fontSize: 10,
        fontWeight: '600',
    },

    // ShopCardFull Styles
    fullContainer: {
        backgroundColor: THEME.white,
        borderRadius: 20,
        marginHorizontal: 16,
        marginVertical: 12,
        overflow: 'hidden',
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    fullBanner: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: THEME.background,
    },
    fullBannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    fullLogoContainer: {
        position: 'absolute',
        bottom: -30,
        left: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: THEME.white,
        backgroundColor: THEME.white,
        overflow: 'hidden',
        zIndex: 10,
    },
    fullLogo: {
        width: '100%',
        height: '100%',
    },
    fullDetails: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    fullHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fullTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: THEME.text,
        marginRight: 8,
    },
    fullDescription: {
        fontSize: 14,
        color: THEME.textSecondary,
        lineHeight: 20,
        marginBottom: 16,
    },
    fullButton: {
        backgroundColor: THEME.primary, // Orange
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    fullButtonText: {
        color: THEME.white,
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Shared Components
    premiumBadge: {
        width: 16,
        height: 16,
        tintColor: THEME.primary,
    },
    chevron: {
        color: THEME.primary,
    }
});
