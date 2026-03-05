import { COLORS } from "@/constants/colors";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/hooks";
import { UserRound } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Fonction utilitaire pour récupérer les initiales du nom
const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

export const Profile = React.memo(() => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    console.log(user)
    // Mémoriser les initiales pour éviter des recalculs inutiles (performance)
    const initials = useMemo(() => getInitials(user?.userName), [user?.userName]);

    return (
        <TouchableOpacity
            onPress={() => {
                // TODO: Naviguer vers la vue de profil détaillée
                console.log("Naviguer vers le profil de:", user?.userName || "Guest");
            }}
            style={styles.container}
            activeOpacity={0.7}
        >
            {isAuthenticated ? (
                <View style={[styles.avatarContainer, styles.authenticatedAvatar]}>

                    <Text style={styles.initialsText}>{initials}</Text>

                    <View style={styles.onlineIndicator} />
                </View>
            ) : (
                <View style={[styles.avatarContainer, styles.guestAvatar]}>
                    <UserRound size={20} color={COLORS.iconLight} strokeWidth={2.5} />
                </View>
            )}
        </TouchableOpacity>
    );
});

Profile.displayName = "Profile";

const styles = StyleSheet.create({
    container: {
        padding: 4, // Hitbox plus large pour l'accessibilité
        marginRight: 4,
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    guestAvatar: {
        backgroundColor: "transparent",
    },
    authenticatedAvatar: {
        backgroundColor: "#E67E22", // Couleur de la marque (fallback si pas d'image)
        borderWidth: 1.5,
        borderColor: "#FFF", // Pour détacher l'avatar du fond
        shadowColor: "#E67E22",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 18, // Doit correspondre à avatarContainer
    },
    initialsText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    onlineIndicator: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#10B981", // Vert émeraude
        borderWidth: 2,
        borderColor: "#FFF", // Bordure pour le détacher de l'avatar
    },
});