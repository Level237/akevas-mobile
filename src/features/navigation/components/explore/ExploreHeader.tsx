import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Props = {
    onBack: () => void;
    onFilterPress?: () => void;
    onSearchChange?: (text: string) => void;
};

const ExploreHeader = ({ onBack, onFilterPress, onSearchChange }: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container,]}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Rechercher un produit..."
                    placeholderTextColor="#999"
                    onChangeText={onSearchChange}
                />
            </View>

            <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
                <Ionicons name="options-outline" size={20} color="#333" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ExploreHeader;
