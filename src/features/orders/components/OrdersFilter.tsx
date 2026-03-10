import { COLORS } from '@/constants/colors';
import { Search } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface OrdersFilterProps {
    searchTerm: string;
    onSearchChange: (text: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

const ORDER_STATUSES = [
    { value: 'all', label: 'Toutes' },
    { value: '0', label: 'En attente' },
    { value: '1', label: 'Confirmé' },
    { value: '2', label: 'Livré' },
    { value: '3', label: 'Annulé' },
];

export const OrdersFilter = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }: OrdersFilterProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher une commande par ID..."
                    value={searchTerm}
                    onChangeText={onSearchChange}
                    placeholderTextColor="#9CA3AF"
                    returnKeyType="search"
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
            >
                {ORDER_STATUSES.map((status) => {
                    const isActive = statusFilter === status.value;
                    return (
                        <TouchableOpacity
                            key={status.value}
                            style={[
                                styles.filterChip,
                                isActive && styles.activeFilterChip
                            ]}
                            onPress={() => onStatusChange(status.value)}
                        >
                            <Text style={[
                                styles.filterText,
                                isActive && styles.activeFilterText
                            ]}>
                                {status.label}
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
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        height: '100%',
    },
    filterScrollContent: {
        paddingRight: 16, // Extra padding at end
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeFilterChip: {
        backgroundColor: COLORS.primaryLight || '#fff4e6',
        borderColor: COLORS.primary || '#ed7e0f',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },
    activeFilterText: {
        color: COLORS.primary || '#ed7e0f',
        fontWeight: '600',
    },
});
