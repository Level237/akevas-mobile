import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecentSearch as RecentSearchType } from './types';

type Props = {
    searches: RecentSearchType[];
    onSelect: (keyword: string) => void;
    onClearAll: () => void;
};

const RecentSearch = ({ searches, onSelect, onClearAll }: Props) => {
    if (searches.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recherches récentes</Text>
                <TouchableOpacity onPress={onClearAll}>
                    <Ionicons name="trash-outline" size={20} color="#999" />
                </TouchableOpacity>
            </View>
            <View style={styles.list}>
                {searches.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.item}
                        onPress={() => onSelect(item.keyword)}
                    >
                        <Ionicons name="time-outline" size={18} color="#999" />
                        <Text style={styles.itemText}>{item.keyword}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#DDD" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        paddingHorizontal: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        color: '#666',
        marginLeft: 12,
    },
});

export default RecentSearch;
