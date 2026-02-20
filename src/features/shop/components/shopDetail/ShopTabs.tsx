import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Tab = 'Produits' | 'À propos' | 'Avis';

type Props = {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
};

const ShopTabs = ({ activeTab, onTabChange }: Props) => {
    const tabs: Tab[] = ['Produits', 'À propos', 'Avis'];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => onTabChange(tab)}
                        style={[styles.tab, isActive && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {tab}
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
        height: 60,
        alignItems: 'center',
    },
    tab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#E67E22', // Orange Akevas
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#E67E22',
        fontWeight: 'bold',
    },
});

export default ShopTabs;
