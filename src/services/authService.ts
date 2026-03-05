
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
    })
})

export const {

    useGetHistorySearchQuery,

} = authService