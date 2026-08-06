import HeaderSetting from '@/components/common/HeaderSetting';

import { useGetNotificationsQuery } from '@/services/authService';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    View
} from 'react-native';
import EmptyNotifications from '../components/EmptyNotifications';
import FilterPills from '../components/FilterPills';
import NotificationItem from '../components/NotificationItem';
import { NotificationSkeleton } from '../components/NotificationSkeleton';

type FilterType = 'Toutes' | 'Commandes' | 'Promos' | 'Alertes';

const NotificationScreen = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('Toutes');

    // Hooks RTK Query
    const { data: notifications = [], isLoading, refetch } = useGetNotificationsQuery("Auth");

    //const [markAsRead] = useMarkAsReadMutation();
    //const [markAllAsRead] = useMarkAllAsReadMutation();
    //const [deleteNotification] = useDeleteNotificationMutation();

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'Toutes') return notifications;
        return notifications.filter((n: any) => {
            if (activeFilter === 'Commandes') return n.type === 'commandes' || n.type === 'order_in_progress';
            if (activeFilter === 'Promos') return n.type === 'promos';
            if (activeFilter === 'Alertes') return n.type === 'alertes';
            return true;
        });
    }, [activeFilter, notifications]);







    const handleNotificationPress = useCallback((notification: any) => {
        // Marquer comme lu
        //handleMarkAsRead(notification.id);

        // Navigation vers le détail de la commande si c'est une notification de commande
        if (notification.data?.order_id) {
            router.push(`/orders/${notification.data.order_id}`);
        }
    }, []);



    if (isLoading) {
        return (
            <View style={styles.container}>
                <HeaderSetting
                    title="Notifications"
                    onRightPress={() => { }}
                />
                <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                <NotificationSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header avec icône de paramètres */}
            <HeaderSetting
                title="Notifications"
                onRightPress={() => { }}
            />

            {/* Filtres */}
            <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            {/* Liste des notifications */}
            <FlatList
                data={filteredNotifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem
                        notification={item}
                        onPress={() => handleNotificationPress(item)}
                        onLongPress={() => { }}
                    />
                )}
                ListEmptyComponent={<EmptyNotifications />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={isLoading}
                onRefresh={refetch}
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