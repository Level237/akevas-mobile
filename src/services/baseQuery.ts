import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = 'https://api.akevas.com';

export const baseQuery = fetchBaseQuery({
    baseUrl,
    timeout: 10000,
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
});