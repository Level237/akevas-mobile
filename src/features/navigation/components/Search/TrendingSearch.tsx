import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TrendingKeyword } from './types';

type Props = {
    keywords: TrendingKeyword[];
    onSelect: (keyword: string) => void;
};

const TrendingSearch = ({ keywords, onSelect }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="flame" size={20} color="#E67E22" />
                <Text style={styles.title}>Tendances actuelles</Text>
            </View>

            <View style={styles.badgeContainer}>
                {keywords.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.badge}
                        onPress={() => onSelect(item.keyword)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trending-up" size={14} color="#666" style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>{item.keyword}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#F2F2F2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    badgeIcon: {
        marginRight: 6,
    },
    badgeText: {
        fontSize: 13,
        color: '#444',
        fontWeight: '600',
    },
});

export default TrendingSearch;

