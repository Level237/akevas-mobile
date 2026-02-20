
import Cart from "@/components/common/Cart";
import SearchResource from "@/components/common/Search";
import { COLORS } from "@/constants/colors";
import { images } from "@/constants/images";
import { router } from 'expo-router';
import { Bell, Menu } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const HomeHeader = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                {/* Left Section: Hamburger + Logo */}
                <View style={styles.leftSection}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.iconButton}
                        onPress={() => router.push('/(navigation)/category')}
                    >
                        <Menu size={28} color={COLORS.iconLight} />
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <Image source={images.logo} style={styles.logo} />
                    </View>
                </View>


                {/* Right Section: Search, Notifications, Cart */}
                <View style={styles.rightSection}>
                    <SearchResource />

                    <TouchableOpacity onPress={() => router.push('/(navigation)/notification')} activeOpacity={0.7} style={styles.iconButton}>
                        <View>
                            <Bell size={24} color={COLORS.iconLight} />
                            <View style={styles.notificationDot} />
                        </View>
                    </TouchableOpacity>

                    <Cart />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // Pour Android
        elevation: 2,
        borderBottomWidth: 0,
        zIndex: 100,
    },
    content: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 2,
        marginRight: 8,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    logoTextOrange: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
        fontFamily: 'System', // Minimalist sans-serif
    },
    logoTextGrey: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.iconLight,
        fontFamily: 'System',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationDot: {
        position: 'absolute',
        top: 0,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        borderWidth: 1.5,
        borderColor: COLORS.background,
    },

    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    }
});

export default HomeHeader;