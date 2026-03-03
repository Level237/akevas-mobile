import Logo from '@/components/common/Logo';
import { MoreVertical, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Props = {
    setSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderShop = ({ setSearchVisible }: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* LEFT: Branding */}
            <Logo />

            {/* CENTER: Modern Search Bar */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSearchVisible(true)}
                style={styles.searchContainer}
            >
                <View style={styles.searchBar}>
                    <Search color="#9CA3AF" size={18} />
                    <Text style={styles.searchPlaceholder} numberOfLines={1}>
                        Rechercher...
                    </Text>
                </View>
            </TouchableOpacity>

            {/* RIGHT: More Options */}
            <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                <MoreVertical color="#1A1A1A" size={24} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,

        borderBottomWidth: 0.3,
        borderBottomColor: '#f3f4f68c',
        zIndex: 10,
        // Elevation for Android
        elevation: 4,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    leftContainer: {
        flex: 1.5,
        justifyContent: 'center',
    },
    brandTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1A1A1A', // Akevas Orange for branding
        letterSpacing: -1.2,
    },
    searchContainer: {
        flex: 3,
        paddingHorizontal: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB', // Slightly lighter grey for higher contrast
        height: 44,
        borderRadius: 12, // More rounded pill shape
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    searchPlaceholder: {
        marginLeft: 8,
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    moreButton: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingLeft: 8,
    },
});

export default React.memo(HeaderShop);