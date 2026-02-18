import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');



const CATEGORIES = [
    { id: '1', name: 'Vêtements', icon: 'shirt-outline' },
    { id: '2', name: 'Chaussures', icon: 'walk-outline' },
    { id: '3', name: 'Bijoux', icon: 'diamond-outline' },
    { id: '4', name: 'Soins & Beauté', icon: 'sparkles-outline' },
    { id: '5', name: 'Sport', icon: 'basketball-outline' },
    { id: '6', name: 'Accessoires', icon: 'watch-outline' },
    { id: '7', name: 'Parfums', icon: 'flask-outline' },
    { id: '8', name: 'Électronique', icon: 'laptop-outline' },
];

type CategoryCardProps = {
    item: typeof CATEGORIES[0];
    isSelected: boolean;
    onPress: () => void;
    index: number;
};

const CategoryCard = ({ item, isSelected, onPress, index }: CategoryCardProps) => {
    return (
        <View
        >
            <TouchableOpacity
                style={[
                    styles.card,
                    isSelected && styles.cardSelected
                ]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={isSelected ? COLORS.primary : COLORS.text}
                />
                <Text style={[
                    styles.cardText,
                    isSelected && styles.cardTextSelected
                ]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default function PreferencesScreen() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [customCategory, setCustomCategory] = useState('');
    const insets = useSafeAreaInsets();
    const toggleCategory = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAddNow = () => {
        if (customCategory.trim()) {
            // Functional logic for adding custom category would go here
            setCustomCategory('');
        } else {
            router.replace('/(tabs)');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mes Préférences</Text>
                <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.skipText}>Passer</Text>
                </TouchableOpacity>
            </View>

            <View
                style={styles.scrollContent}
            >
                {/* Intro */}
                <View>

                    <Text style={styles.subText}>
                        Choisissez vos centres d'interets pour la personnalisation de vos produits
                    </Text>
                </View>

                {/* Category Grid */}
                <View style={styles.grid}>
                    {CATEGORIES.map((item, index) => (
                        <CategoryCard
                            key={item.id}
                            item={item}
                            index={index}
                            isSelected={selectedIds.includes(item.id)}
                            onPress={() => toggleCategory(item.id)}
                        />
                    ))}
                </View>


                <View
                    style={styles.customSection}
                >


                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddNow}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>
                            {selectedIds.length >= 5 ? 'Continuer' : 'Continuer'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    skipText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        flex: 1
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8,
    },
    subText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: 30,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        gap: 12,
        marginBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        minWidth: (width - 52) / 2, // 2 columns with gap
    },
    cardSelected: {
        color: COLORS.primary,
        borderColor: COLORS.primary,
    },
    cardText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 10,
    },
    cardTextSelected: {
        color: COLORS.primary,
    },
    customSection: {
        marginTop: 20,
        paddingTop: 20,
        justifyContent: "flex-end",

    },
    nicheTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 6,
    },
    nicheSubTitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        fontSize: 16,
        color: COLORS.text,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
