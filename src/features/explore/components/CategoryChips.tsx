import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types';

type Props = {
    categories: Category[];
    selectedId: string;
    onSelect: (id: string) => void;
};

const CategoryChips = ({ categories, selectedId, onSelect }: Props) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const isSelected = category.id === selectedId;
                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.chip,
                                isSelected && styles.chipSelected
                            ]}
                            onPress={() => onSelect(category.id)}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.label,
                                isSelected && styles.labelSelected
                            ]}>
                                {category.label}
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
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    chipSelected: {
        backgroundColor: '#E67E22',
        borderColor: '#E67E22',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    labelSelected: {
        color: '#FFF',
    },
});

export default CategoryChips;
