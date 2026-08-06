
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./baseQueryWithReauth";

export const authService = createApi({
    baseQuery: baseQueryWithAuth,
    reducerPath: "authService",
    tagTypes: ['Auth', 'User', 'Notifications'],
    endpoints: builder => ({
        getHistorySearch: builder.query({
            query: () => ({
                url: '/api/v1/recents/histories',
                method: 'GET'
            }),
            providesTags: ['Auth']
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/api/v1/logout",
                method: "POST",
            }),
            invalidatesTags: ['Auth', 'User']
        }),
        getNotifications: builder.query({
            query: () => ({
                url: '/api/v1/customer/notifications',
                method: 'GET'
            }),

            transformResponse: (response) => {


                return response.map((notif: any) => {
                    const data = typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data;

                    return {
                        id: notif.id,
                        type: data.type === 'order_in_progress' ? 'commandes' :
                            data.type === 'order_confirmation' ? 'commandes' : 'alertes',
                        title: data.type === 'order_in_progress' ? 'Commande en cours' :
                            data.type === 'order_confirmation' ? 'Commande confirmée' : 'Notification',
                        description: data.message || '',
                        timestamp: new Date(notif.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        isRead: notif.read_at !== null,
                        data: data,
                    };
                });
            },
        }),
        getUser: builder.query({
            query: () => ({
                url: '/api/v1/user',
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        getOrders: builder.query({
            query: () => '/api/v1/list/orders',
            providesTags: ['Auth'],
        }),
        getOrderDetail: builder.query({
            query: (id) => `/api/v1/user/show/order/${id}`,
            providesTags: ['Auth'],
        }),
        showPaymentWithReference: builder.query({
            query: (ref) => ({
                url: `/api/v1/show/payment/${ref}`,
                method: "GET"
            })
        }),
        initPayin: builder.mutation({
            query: (body) => ({
                url: `/api/v1/payin`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Auth']
        }),
        verifyPayin: builder.mutation({
            query: (formData) => ({
                url: `/api/status/payin`,
                method: 'POST',
                body: formData
            })
        }),
        getListShopReviews: builder.query({
            query: (shopId) => ({
                url: `/api/list/reviews/shop/${shopId}`,
                method: 'GET'
            }),
            providesTags: ['Auth'],
        }),
        addShopReview: builder.mutation({
            query: (body) => ({
                url: `/api/v1/user/add/review/shop`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Auth']
        }),
        controlPayment: builder.mutation({
            query: (body) => ({
                url: '/api/v1/control/payment',
                method: 'POST',
                body: body
            })
        }),
    })
})

export const {
    useGetHistorySearchQuery,
    useLogoutMutation,
    useGetOrdersQuery,
    useGetOrderDetailQuery,
    useShowPaymentWithReferenceQuery,
    useGetUserQuery,
    useGetListShopReviewsQuery,
    useAddShopReviewMutation,
    useInitPayinMutation,
    useVerifyPayinMutation,
    useGetNotificationsQuery,
    useControlPaymentMutation,
} = authService