
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cart from './Cart';
import SearchResource from './Search';

type Props = {
    title: string;
    showCart?: boolean;
    rightComponent?: React.ReactNode;
};

const HeaderScreen = ({ title, showCart = true, rightComponent }: Props) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                {/* GAUCHE : Bouton Retour */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={26} color="#333" />
                </TouchableOpacity>

                {/* CENTRE : Titre Dynamique */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {/* DROITE : Panier ou Composant Custom */}
                <View style={{ marginRight: 12, marginLeft: -20 }}>

                    <SearchResource />
                </View>

                <Cart />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#FFF',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
        elevation: 3, // Ombre Android
        shadowColor: '#000', // Ombre iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    rightContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    iconButton: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -2,
        top: -2,
        backgroundColor: '#E67E22', // Ton orange Akevas
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});

export default HeaderScreen;