import { ClipboardList, Coins, MapPin, Star } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2; // Subtracting horizontal padding and gap

type QuickActionItemProps = {
    icon: React.ElementType;
    title: string;
    value: string;
    iconColor: string;
    onPress?: () => void;
};

const QuickActionItem = ({ icon: Icon, title, value, iconColor, onPress }: QuickActionItemProps) => (
    <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <Icon size={22} color={iconColor} strokeWidth={2.5} />
        </View>
        <View style={styles.contentContainer}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemValue}>{value}</Text>
        </View>
    </TouchableOpacity>
);

const QuickActionGrid = () => {
    return (
        <View style={styles.gridContainer}>
            <QuickActionItem
                icon={ClipboardList}
                title="Commandes"
                value="15 commandes"
                iconColor="#3B82F6" // Blue
            />
            <QuickActionItem
                icon={Star}
                title="Mes Avis"
                value="12 avis"
                iconColor="#F59E0B" // Amber
            />
            <QuickActionItem
                icon={Coins}
                title="Mon Solde"
                value="500.25 Coins"
                iconColor="#E67E22" // Akevas Orange
            />
            <QuickActionItem
                icon={MapPin}
                title="Adresses"
                value="2 adresses"
                iconColor="#10B981" // Emerald
            />
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        gap: 10,
        marginVertical: 10,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,

        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    itemValue: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
});

export default React.memo(QuickActionGrid);
