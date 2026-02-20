import HeaderSetting from '@/components/common/HeaderSetting';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import EmptyNotifications from '../components/EmptyNotifications';
import FilterPills from '../components/FilterPills';
import NotificationItem from '../components/NotificationItem';
import { FilterType, MOCK_NOTIFICATIONS, Notification } from '../types';

const NotificationScreen = () => {
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
            "Supprimer",
            "Voulez-vous supprimer cette notification ?",
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

    const handleMorePress = useCallback(() => {
        const options = ['Mark all as read', 'Delete all read', 'Cancel'];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                },
                buttonIndex => {
                    if (buttonIndex === 0) handleMarkAllRead();
                    if (buttonIndex === 1) {
                        setNotifications(prev => prev.filter(n => !n.isRead));
                    }
                }
            );
        } else {
            Alert.alert(
                "Options",
                "Actions sur les notifications",
                [
                    { text: "Tout marquer comme lu", onPress: handleMarkAllRead },
                    { text: "Supprimer les lus", style: 'destructive', onPress: () => setNotifications(prev => prev.filter(n => !n.isRead)) },
                    { text: "Annuler", style: 'cancel' }
                ]
            );
        }
    }, [handleMarkAllRead]);

    return (
        <View style={styles.container}>
            {/* Premium Custom Header with Settings Icon */}
            <HeaderSetting
                title="Notifications"
                onRightPress={handleMorePress}
            />

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
    listContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});

export default NotificationScreen;

