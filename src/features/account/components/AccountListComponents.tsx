import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AccountListItemProps = {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
};

export const AccountListItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showChevron = true
}: AccountListItemProps) => (
    <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.7}
        onPress={onPress}
    >
        <View style={styles.iconWrapper}>
            <Icon size={20} color="#111827" strokeWidth={2} />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>

        {subtitle && (
            <Text style={styles.itemSubtitle}>{subtitle}</Text>
        )}

        {showChevron && (
            <ChevronRight size={18} color="#9CA3AF" />
        )}
    </TouchableOpacity>
);

type AccountSectionProps = {
    title: string;
    children: React.ReactNode;
};

export const AccountSection = ({ title, children }: AccountSectionProps) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.itemsWrapper}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    itemsWrapper: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginRight: 8,
    },
});
