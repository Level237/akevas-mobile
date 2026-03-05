import { Product } from '@/types/product';
import { Shop } from '@/types/seller';

export type RecentSearch = {
    id: string;
    search_term: string;
    created_at: string;
};

export type TrendingKeyword = {
    id: string;
    keyword: string;
};

export type SearchSuggestion = {
    shops: Shop[];
    products: Product[];
};

export type SearchState = {
    query: string;
    isSearching: boolean;
    recentSearches: RecentSearch[];
    trendingKeywords: TrendingKeyword[];
    suggestions: SearchSuggestion | null;
};
