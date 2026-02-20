import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SearchSuggestion } from './types';

type Props = {
    suggestions: SearchSuggestion[];
    onSelect: (text: string) => void;
};

const SearchSuggestions = ({ suggestions, onSelect }: Props) => {
    return (
        <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => onSelect(item.text)}
                >
                    <Ionicons name="search-outline" size={18} color="#AAA" />
                    <Text style={styles.itemText}>{item.text}</Text>
                    <Ionicons name="arrow-up-outline" size={18} color="#EEE" style={{ transform: [{ rotate: '-45deg' }] }} />
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
        />
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
});

export default SearchSuggestions;
