import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FilterType } from '../types';

type Props = {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
};

const FilterPills = ({ activeFilter, onFilterChange }: Props) => {
    const filters: FilterType[] = ['Toutes', 'Commandes', 'Promos', 'Alertes'];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filters.map((filter) => {
                    const isActive = activeFilter === filter;
                    return (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => onFilterChange(filter)}
                            style={[styles.pill, isActive && styles.activePill]}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.pillText, isActive && styles.activePillText]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    activePill: {
        backgroundColor: '#E67E2215',
        borderColor: '#E67E22',
    },
    pillText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    activePillText: {
        color: '#E67E22',
    },
});

export default FilterPills;
