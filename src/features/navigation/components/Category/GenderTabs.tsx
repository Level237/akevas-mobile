import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gender } from '../../types';

type Props = {
    activeGender: Gender;
    onGenderChange: (gender: Gender) => void;
};

const GenderTabs = ({ activeGender, onGenderChange }: Props) => {
    const genders: Gender[] = ['HOMME', 'FEMME', 'ENFANT'];

    return (
        <View style={styles.container}>
            {genders.map((gender) => {
                const isActive = activeGender === gender;
                return (
                    <TouchableOpacity
                        key={gender}
                        onPress={() => onGenderChange(gender)}
                        style={[styles.tab, isActive && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {gender}
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
