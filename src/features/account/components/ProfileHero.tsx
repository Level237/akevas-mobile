import { Image } from 'expo-image';
import { Settings } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const COVER_HEIGHT = 180;
const AVATAR_SIZE = 90;

type ProfileHeroProps = {
    userName?: string;
    handle?: string;
    memberSince?: string;
    avatarUri?: string;
    coverUri?: string;
    onEditProfile?: () => void;
    onSettings?: () => void;
};

const ProfileHero = ({
    userName = "John Doe",
    handle = "@johndoe_akv",
    memberSince = "Membre depuis Mars 2024",
    avatarUri = "https://i.pravatar.cc/150?u=akevas_user",
    coverUri = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000",
    onEditProfile,
    onSettings
}: ProfileHeroProps) => {
    return (
        <View style={styles.container}>
            {/* Cover Photo */}
            <Image
                source={coverUri}
                style={styles.coverImage}
                contentFit="cover"
            />
            <View style={styles.coverOverlay} />

            {/* Top Bar Actions */}
            <View style={styles.topActions}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onSettings}
                >
                    <Settings color="#FFF" size={24} />
                </TouchableOpacity>
            </View>

            {/* Profile Info Overlay */}
            <View style={styles.profileInfoContainer}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={avatarUri}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={200}
                    />
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.handle}>{handle}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={onEditProfile}
                        >
                            <Text style={styles.editButtonText}>Modifier</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.memberDate}>{memberSince}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    coverImage: {
        width: width,
        height: COVER_HEIGHT,
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: COVER_HEIGHT,
    },
    topActions: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfoContainer: {
        paddingHorizontal: 20,
        marginTop: -(AVATAR_SIZE / 2),
    },
    avatarWrapper: {
        width: AVATAR_SIZE + 6,
        height: AVATAR_SIZE + 6,
        borderRadius: (AVATAR_SIZE + 6) / 2,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: '#F3F4F6',
    },
    detailsContainer: {
        marginTop: 12,
        paddingBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: -0.5,
    },
    handle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
        fontWeight: '500',
    },
    memberDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
        fontWeight: '500',
    },
    editButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    editButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
});

export default React.memo(ProfileHero);
