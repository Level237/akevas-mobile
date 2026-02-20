import HeaderScreen from '@/components/common/HeaderScreen';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyNotifications from '../components/EmptyNotifications';
import FilterPills from '../components/FilterPills';
import NotificationItem from '../components/NotificationItem';
import { FilterType, MOCK_NOTIFICATIONS, Notification } from '../types';

const NotificationScreen = () => {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState<FilterType>('Toutes');

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'Toutes') return notifications;
        return notifications.filter(n => n.type === activeFilter.toLowerCase());
    }, [activeFilter, notifications]);

    const handleMarkAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    }, []);

    const handleMarkAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const handleDelete = useCallback((id: string) => {
        Alert.alert(
            "Supprimer la notification",
            "Voulez-vous vraiment supprimer cette notification ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => setNotifications(prev => prev.filter(n => n.id !== id))
                }
            ]
        );
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderScreen title="Notifications" />
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {notifications.some(n => !n.isRead) && (
                    <TouchableOpacity onPress={handleMarkAllRead}>
                        <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Filters */}
            <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            {/* List */}
            <FlatList
                data={filteredNotifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem
                        notification={item}
                        onPress={handleMarkAsRead}
                        onLongPress={handleDelete}
                    />
                )}
                ListEmptyComponent={<EmptyNotifications />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    markAllRead: {
        fontSize: 14,
        color: '#E67E22',
        fontWeight: '600',
    },
    listContent: {
        flexGrow: 1,
    },
});

export default NotificationScreen;
