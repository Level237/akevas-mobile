export type RecentSearch = {
    id: string;
    keyword: string;
};

export type TrendingKeyword = {
    id: string;
    keyword: string;
};

export type SearchSuggestion = {
    id: string;
    text: string;
};

export type SearchState = {
    query: string;
    isSearching: boolean;
    recentSearches: RecentSearch[];
    trendingKeywords: TrendingKeyword[];
    suggestions: SearchSuggestion[];
};
