
import { useGetCurrentHomeByGenderQuery } from '@/services/guardService';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryCard from '../components/Category/CategoryCard';
import GenderTabs from '../components/Category/GenderTabs';
import SkeletonCategory from '../components/Category/SkeletonCategory';

const MenuScreen = () => {
    const insets = useSafeAreaInsets();
    const [activeGender, setActiveGender] = useState<number>(1);
    const [isTabChanging, setIsTabChanging] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const { data, isLoading, isError } = useGetCurrentHomeByGenderQuery(activeGender, {
        skip: !activeGender, // Très bien, ça évite les appels vides
        refetchOnMountOrArgChange: true, // Je conseille True pour une Home, pour avoir les données fraîches au retour
        refetchOnFocus: false, // Bien, pas la peine de spammer en changeant d'onglet
        refetchOnReconnect: false // Bien
    });

    const currentGender = data?.data;
    //console.log(currentGender);




    const handleClose = useCallback(() => {
        router.back();
    }, []);

    const currentCategories = currentGender?.categories;

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

            {/* Grid or Skeleton */}
            {isLoading || isTabChanging ? (
                <SkeletonCategory />
            ) : (
                <FlatList
                    data={currentCategories}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => <CategoryCard category={item} />}
                    contentContainerStyle={styles.gridContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
