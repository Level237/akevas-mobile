import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cart from './Cart';
import SearchResource from './Search';

type Props = {
    title: string;
};

const HeaderTabs = ({ title }: Props) => {
    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>

                {/* GAUCHE : Titre aligné au début */}
                <View style={styles.leftContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {/* DROITE : Groupe d'icônes (Recherche + Panier) */}
                <View style={styles.rightIconsGroup}>
                    <View style={styles.iconSpacing}>
                        <SearchResource />
                    </View>
                    <Cart />
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#FFF',
        // On garde une bordure très fine pour séparer du contenu
        borderBottomWidth: 0.5,
        borderBottomColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    container: {
        height: 60, // Légèrement plus haut pour un look plus aéré
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, // Plus de marge sur les côtés
        justifyContent: 'space-between', // Pousse le titre à gauche et les icônes à droite
    },
    leftContainer: {
        flex: 1, // Prend tout l'espace disponible pour pousser la droite
    },
    title: {
        fontSize: 22, // Titre plus grand car il est en tête de section
        fontWeight: '800', // Très gras pour le style Marketplace
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    rightIconsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginRight: 15, // Espacement propre entre la loupe et le panier
    }
});

export default HeaderTabs;