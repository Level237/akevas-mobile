
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";




export const guardService = createApi({
    baseQuery: baseQuery,
    reducerPath: "guardService",
    tagTypes: ['guard'],
    endpoints: builder => ({

        getCategories: builder.query({

            query: () => ({
                url: '/api/categories',
                method: 'GET',
            }),
            providesTags: ['guard'],

        }),
        getTowns: builder.query({
            query: () => ({
                url: "/api/towns",
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getQuarters: builder.query({
            query: () => ({
                url: `/api/quarters`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getShop: builder.query({
            query: (id) => `/api/shop/${id}`,
            providesTags: ['guard'],
        }),
        checkIfEmailExists: builder.mutation({
            query: (formData) => ({
                url: `/api/check/email-and-phone-number`,
                method: "POST",

                body: formData,
            }),
            invalidatesTags: ['guard'],
            //transformResponse: (response: { data: { message: string } }) => response.data.message,
        }),
        getCategoriesWithParentIdNull: builder.query({
            query: (genderId) => {

                let url = `/api/categories/with-parent-id-null`;
                if (genderId != 4) {
                    // L'argument est ici directement la valeur du genre (ex: 'homme')
                    // Note: Nous utilisons 'g' comme nom de paramètre API pour rester cohérent avec l'URL frontend
                    url = `${url}?gender=${genderId}`;
                }

                return {
                    url: url, // L'URL peut être /api/categories/with-parent-id-null?g=homme ou sans paramètre
                    method: "GET",
                };
            },
            providesTags: ['guard'],
        }),
        getCategoriesWithParentId: builder.query({
            query: ({ id, genderId }) => {
                let url = `/api/category/gender/${id}`;
                if (genderId != 4) {
                    // L'argument est ici directement la valeur du genre (ex: 'homme')
                    // Note: Nous utilisons 'g' comme nom de paramètre API pour rester cohérent avec l'URL frontend
                    url = `${url}?gender=${genderId}`;
                }
                return {
                    url: url, // L'URL peut être /api/categories/with-parent-id-null?g=homme ou sans paramètre
                    method: "GET",
                };
            },
            providesTags: ['guard'],
        }),
        getCategoryByGender: builder.query({
            query: (id) => ({
                url: `/api/get/category/by-gender/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getSubCategories: builder.query({
            query: ({ arrayId, id }) => ({
                url: `/api/get/sub-categories/${arrayId}/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        filterProducts: builder.query({
            query: ({ arrayId }) => ({
                url: `/api/filter/products/${arrayId}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getHomeShops: builder.query({
            query: () => ({
                url: `/api/home/shops`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),

        getCurrentHomeByGender: builder.query({
            query: (id) => ({
                url: `/api/current/gender/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getHomeProducts: builder.query({
            query: () => ({
                url: `/api/home/products`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getProductByUrl: builder.query({
            query: (url) => ({
                url: `/api/product/detail/${url}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getAllProducts: builder.query({
            query: ({ page = 1, min_price, max_price, categories, colors, attribut, gender, seller_mode, bulk_price_range }) => {
                const params = new URLSearchParams();

                // On utilise 'page' au lieu de 'cursor'
                params.append('page', page.toString());

                if (min_price && min_price > 0) params.append('min_price', min_price.toString());
                if (max_price && max_price < 500000) params.append('max_price', max_price.toString());
                if (categories?.length > 0) params.append('categories', categories.join(','));
                if (colors?.length > 0) params.append('colors', colors.join(','));
                if (attribut?.length > 0) params.append('attribut', attribut.join(','));
                if (gender?.length > 0) params.append('gender', gender.join(','));
                if (seller_mode) params.append('seller_mode', 'true');
                if (bulk_price_range) params.append('bulk_price_range', bulk_price_range);

                return {
                    url: `/api/all/products?${params.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response: any) => ({
                productList: response.data,
                // On extrait les infos de pagination depuis l'objet 'meta'
                currentPage: response.meta.current_page,
                lastPage: response.meta.last_page,
                total: response.meta.total,
                hasMore: response.meta.current_page < response.meta.last_page
            }),
            providesTags: ['guard'],
        }),




    }),
})
export const {
    useGetShopQuery,
    useGetCategoriesQuery,
    useGetTownsQuery,
    useGetQuartersQuery,
    useCheckIfEmailExistsMutation,
    useGetCategoriesWithParentIdNullQuery,
    useGetCategoriesWithParentIdQuery,
    useGetCategoryByGenderQuery,
    useGetSubCategoriesQuery,
    useGetHomeShopsQuery,
    useGetCurrentHomeByGenderQuery,
    useGetHomeProductsQuery,
    useGetProductByUrlQuery,
    useGetAllProductsQuery,
    useFilterProductsQuery,
} = guardService