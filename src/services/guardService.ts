
import { Product } from "@/types/product";
import { Shop } from "@/types/seller";
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

        checkIfPhoneExists: builder.mutation({
            query: (formData) => ({
                url: `/api/check/login/phone-number`,
                method: "POST",

                body: formData,
            }),
            invalidatesTags: ['guard'],
            //transformResponse: (response: { data: { message: string } }) => response.data.message,
        }),

        login: builder.mutation({
            query: (credentials) => ({
                url: '/api/login/mobile', // Ton endpoint Laravel
                method: 'POST',
                body: credentials,
            }),
        }),
        // Tu peux ajouter register, logout, etc. ici


        getCategoriesWithParentIdNull: builder.query({
            query: (genderId) => {
                console.log(genderId);
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
        allGenders: builder.query({
            query: () => ({
                url: "/api/all/genders",
                method: "GET"
            })
        }),

        getProfileShop: builder.query({
            query: () => ({
                url: '/api/get/profile/shop',
                method: "GET"
            })
        }),

        getAllShops: builder.query({
            query: (page) => ({
                url: `/api/all/shops?page=${page}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Shop[], meta: { last_page: number, current_page: number, total: number } }) => ({
                shopList: response.data,
                totalPagesResponse: response.meta.last_page,
                currentPageResponse: response.meta.current_page,
                totalShopsResponse: response.meta.total,
            }),
            providesTags: ['guard'],
        }),

        getCurrentHomeByGender: builder.query({
            query: (id) => ({
                url: `/api/current/gender/categories/${id}`,
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
        searchByQuery: builder.query({
            query: ({ query, userId }) => ({
                url: `/api/search/${query}/${userId}`,
                method: "GET"
            })
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

        getCategoryProductsByUrl: builder.query({
            query: ({ url, page, min_price, max_price, colors, attribut, gender, seller_mode, bulk_price_range }: { url: string, page?: number, min_price?: number, max_price?: number, colors?: string[], attribut?: number[], gender?: number[], seller_mode?: boolean, bulk_price_range?: string }) => {
                const params = new URLSearchParams();
                if (page) params.append('page', page.toString());
                if (min_price && min_price > 0) params.append('min_price', min_price.toString());
                if (max_price && max_price < 500000) params.append('max_price', max_price.toString());
                if (colors && colors.length > 0) params.append('colors', colors.join(','));
                if (attribut && attribut.length > 0) params.append('attribut', attribut.join(','));
                if (gender && gender.length > 0) params.append('gender', gender.join(','));
                if (seller_mode !== undefined && seller_mode !== false) params.append('seller_mode', seller_mode.toString());
                if (bulk_price_range) params.append('bulk_price_range', bulk_price_range);
                return {
                    url: `/api/product/by-category/${url}${params.toString() ? `?${params.toString()}` : ''}`,
                    method: 'GET'
                };
            },
            transformResponse: (response: { data: Product[], meta?: { last_page: number, current_page: number, total: number } }) => ({
                productList: response.data,
                totalPagesResponse: response.meta?.last_page ?? 1,
                currentPageResponse: response.meta?.current_page ?? 1,
                totalProductsResponse: response.meta?.total ?? response.data?.length ?? 0,
            }),
        }),




    }),
})
export const {
    useGetShopQuery,
    useGetCategoriesQuery,
    useGetTownsQuery,
    useGetQuartersQuery,
    useGetCategoryProductsByUrlQuery,
    useCheckIfEmailExistsMutation,
    useCheckIfPhoneExistsMutation,
    useGetCategoriesWithParentIdNullQuery,
    useGetCategoriesWithParentIdQuery,
    useGetCategoryByGenderQuery,
    useGetSubCategoriesQuery,
    useGetAllShopsQuery,
    useLoginMutation,
    useSearchByQueryQuery,
    useGetHomeShopsQuery,
    useGetProfileShopQuery,
    useAllGendersQuery,
    useGetCurrentHomeByGenderQuery,
    useGetHomeProductsQuery,
    useGetProductByUrlQuery,
    useGetAllProductsQuery,
    useFilterProductsQuery,
} = guardService