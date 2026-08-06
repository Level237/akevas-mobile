import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const getIconConfig = (type: any, data?: any) => {
    if (type === 'commandes' || type === 'order_in_progress' || type === 'order_confirmation') {
        if (data?.status === 'in_progress') {
            return { name: 'cube-outline' as const, color: '#ed7e0f', bgColor: '#FFF5EB' }; // Orange Akevas
        }
        return { name: 'cart-outline' as const, color: '#3498DB', bgColor: '#EBF5FB' };
    }

    switch (type) {
        case 'promos':
            return { name: 'pricetag-outline' as const, color: '#F1C40F', bgColor: '#FEF9E7' };
        case 'alertes':
            return { name: 'notifications-outline' as const, color: '#E74C3C', bgColor: '#FDEDEC' };
        default:
            return { name: 'chatbox-outline' as const, color: '#95A5A6', bgColor: '#F4F6F6' };
    }
};

const NotificationItem = ({ notification, onPress, onLongPress }: any) => {
    const iconConfig = getIconConfig(notification.type, notification.data);

    return (
        <TouchableOpacity
            style={[styles.container, !notification.isRead && styles.unreadBackground]}
            onPress={() => onPress(notification.id)}
            onLongPress={() => onLongPress(notification.id)}
            activeOpacity={0.7}
        >
            {/* Icône */}
            <View style={[styles.iconCircle, { backgroundColor: iconConfig.bgColor }]}>
                <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
            </View>

            {/* Contenu */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text
                        style={[styles.title, !notification.isRead && styles.unreadText]}
                        numberOfLines={1}
                    >
                        {notification.title}
                    </Text>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {notification.description}
                </Text>

                {/* Afficher l'ID de commande si disponible */}
                {notification.data?.order_id && (
                    <Text style={styles.orderId}>
                        Commande #{notification.data.order_id}
                    </Text>
                )}

                <Text style={styles.time}>{notification.timestamp}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    unreadBackground: {
        backgroundColor: '#FFF',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    unreadText: {
        fontWeight: 'bold',
        color: '#000',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E67E22',
        marginLeft: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 6,
    },
    orderId: {
        fontSize: 12,
        color: '#ed7e0f',
        fontWeight: '600',
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
});

export default memo(NotificationItem);