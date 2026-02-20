import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryCard from '../components/CategoryCard';
import GenderTabs from '../components/GenderTabs';
import { CATEGORIES, Gender } from '../types';

const MenuScreen = () => {
    const insets = useSafeAreaInsets();
    const [activeGender, setActiveGender] = useState<Gender>('FEMME');

    const filteredCategories = useMemo(() =>
        CATEGORIES.filter(c => c.gender === activeGender),
        [activeGender]);

    const handleClose = useCallback(() => {
        router.back();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={28} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <GenderTabs activeGender={activeGender} onGenderChange={setActiveGender} />

            {/* Grid */}
            <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => <CategoryCard category={item} />}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    gridContent: {
        padding: 16,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});

export default MenuScreen;
