import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = 'https://dev-api.akevas.com';

export const baseQuery = fetchBaseQuery({
    baseUrl,
    timeout: 45000,
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
});