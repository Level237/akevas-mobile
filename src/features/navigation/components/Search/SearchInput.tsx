import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    onCancel?: () => void;
};

const SearchInput = ({ value, onChangeText, onCancel }: Props) => {
    const insets = useSafeAreaInsets();

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <View style={styles.inputWrapper}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Rechercher sur Akevas..."
                    style={styles.input}
                    autoFocus={true}
                    placeholderTextColor="#999"
                    returnKeyType="search"
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
        </View>
    );
};

import { Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    inputWrapper: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        padding: 4,
    },
    cancelButton: {
        marginLeft: 15,
        paddingVertical: 8,
    },
    cancelText: {
        color: '#E67E22', // Orange Akevas
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SearchInput;
