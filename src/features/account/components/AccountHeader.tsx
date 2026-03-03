import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AccountHeaderProps = {
    userAvatar?: string;
    onLogout?: () => void;
};

const AccountHeader = ({ userAvatar, onLogout }: AccountHeaderProps) => {
    // Placeholder image if no avatar provided
    const avatarUri = userAvatar || 'https://i.pravatar.cc/150?u=akevas_user';

    return (
        <View style={styles.headerContainer}>
            <Image
                source={avatarUri}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
            />

            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Paramètres</Text>
            </View>

            <TouchableOpacity onPress={onLogout} activeOpacity={0.7}>
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444', // Red for logout
    },
});

export default React.memo(AccountHeader);
