
import { createApi } from "@reduxjs/toolkit/query/react"
import baseQueryWithAuth from "./baseQueryWithReauth"

export const authService = createApi({
    baseQuery: baseQueryWithAuth,
    reducerPath: "authService",
    tagTypes: ['Auth', 'User'],
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
    })
})

export const {
    useGetHistorySearchQuery,
    useLogoutMutation,
    useGetOrdersQuery,
    useGetOrderDetailQuery,
    useShowPaymentWithReferenceQuery,
    useGetUserQuery,
} = authService