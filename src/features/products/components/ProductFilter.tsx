import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type SortOption = { label: string; value: string };

const SORT_OPTIONS: SortOption[] = [
    { label: 'Plus populaires', value: 'popular' },
    { label: 'Prix croissant', value: 'price_asc' },
    { label: 'Prix décroissant', value: 'price_desc' },
    { label: 'Nouveautés', value: 'newest' },
];

type Props = {
    onFilterPress?: () => void;
    onSortChange?: (value: string) => void;
};

const ProductFilter = ({ onFilterPress, onSortChange }: Props) => {
    const [selectedSort, setSelectedSort] = useState<SortOption>(SORT_OPTIONS[0]);
    const [showSortMenu, setShowSortMenu] = useState(false);

    const handleSelectSort = (option: SortOption) => {
        setSelectedSort(option);
        setShowSortMenu(false);
        onSortChange?.(option.value);
    };

    return (
        <View style={styles.container}>
            {/* Filter Button */}
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.7}>
                <Ionicons name="filter-outline" size={18} color="#333" />
                <Text style={styles.filterText}>Filtres</Text>
            </TouchableOpacity>

            {/* Sort Dropdown Trigger */}
            <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowSortMenu(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.sortLabel}>{selectedSort.label}</Text>
                <Ionicons name="chevron-down" size={16} color="#E67E22" />
            </TouchableOpacity>

            {/* Sort Modal */}
            <Modal
                visible={showSortMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSortMenu(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setShowSortMenu(false)}>
                    <View style={styles.menu}>
                        <Text style={styles.menuTitle}>Trier par</Text>
                        {SORT_OPTIONS.map((option) => {
                            const isActive = selectedSort.value === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                                    onPress={() => handleSelectSort(option)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                                        {option.label}
                                    </Text>
                                    {isActive && <Ionicons name="checkmark" size={18} color="#E67E22" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F9F9F9',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 9,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    sortLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E67E22',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    menu: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 4,
    },
    menuItemActive: {
        backgroundColor: '#FEF2E8',
    },
    menuItemText: {
        fontSize: 15,
        color: '#555',
        fontWeight: '500',
    },
    menuItemTextActive: {
        color: '#E67E22',
        fontWeight: 'bold',
    },
});

export default ProductFilter;
