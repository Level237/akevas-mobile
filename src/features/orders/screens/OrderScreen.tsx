import { COLORS } from '@/constants/colors';
import { useGetOrdersQuery } from '@/services/authService';

import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Components
import HeaderScreen from '@/components/common/HeaderScreen';
import { Package } from 'lucide-react-native';
import { OrderItemCard } from '../components/OrderItemCard';
import { OrdersFilter } from '../components/OrdersFilter';
import { OrdersListSkeleton } from '../components/OrderSkeleton';

const OrderScreen = () => {
    const router = useRouter();
    const { data: orders, isLoading, isFetching, refetch } = useGetOrdersQuery(undefined);
    const insets = useSafeAreaInsets();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter((order: any) => {
            const orderId = order?.order?.id || order?.id;
            const matchesSearch = orderId ? orderId.toString().includes(searchTerm) : false;

            // Note: The status filter might need adjusting based on how the API returns 'status'
            // whether it's inside `order.order.status` or `order.status`
            const orderStatus = order?.order?.status?.toString() || order?.status?.toString();
            const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const renderHeader = () => (
        <View style={styles.header}>

            <HeaderScreen title='Commandes' />
        </View >
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Package size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>Aucune commande trouvée</Text>
            <Text style={styles.emptyStateDesc}>
                {searchTerm || statusFilter !== 'all'
                    ? "Essayez de modifier vos filtres de recherche."
                    : "Vous n'avez pas encore passé de commande."}
            </Text>
            {(!searchTerm && statusFilter === 'all') && (
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => router.push('/home')}
                >
                    <Text style={styles.shopButtonText}>Découvrir nos produits</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.safeArea]}>

                {renderHeader()}
                <OrdersFilter
                    searchTerm="" onSearchChange={() => { }}
                    statusFilter="all" onStatusChange={() => { }}
                />
                <OrdersListSkeleton />
            </View>
        );
    }

    return (
        <View style={[styles.safeArea]}>

            {renderHeader()}

            <OrdersFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            <FlatList
                data={filteredOrders}
                keyExtractor={(item, index) => {
                    const id = item?.order?.id || item?.id;
                    return id ? id.toString() : `order-${index}`;
                }}
                renderItem={({ item }) => <OrderItemCard order={item} />}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching && !isLoading}
                        onRefresh={refetch}
                        colors={[COLORS.primary || '#ed7e0f']}
                        tintColor={COLORS.primary || '#ed7e0f'}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {

        marginVertical: 26,
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
    },
    continueButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    continueButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Extra padding for tab bar if needed
    },
    emptyState: {
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    shopButton: {
        backgroundColor: COLORS.primary || '#ed7e0f',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    shopButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    }
});

export default OrderScreen;
