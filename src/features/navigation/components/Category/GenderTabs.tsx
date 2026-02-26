import { Gender } from '@/services/gender';
import { useAllGendersQuery } from '@/services/guardService';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


type Props = {
    activeGender: number;
    onGenderChange: (gender: number) => void;
};

const GenderTabs = ({ activeGender, onGenderChange }: Props) => {

    const { data: genders, isLoading, isError } = useAllGendersQuery('guard');

    return (
        <View style={styles.container}>
            {!isLoading && genders && genders.map((gender: Gender) => {
                const isActive: boolean = activeGender === gender.id;
                return (
                    <TouchableOpacity
                        key={gender.id}
                        onPress={() => onGenderChange(gender.id)}
                        style={[styles.tab, isActive && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {gender.gender_name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        height: 50,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#E67E22', // Orange Akevas
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    activeTabText: {
        color: '#E67E22',
        fontWeight: 'bold',
    },
});

export default GenderTabs;
