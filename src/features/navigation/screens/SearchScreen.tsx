import { COLORS } from '@/constants/colors';
import { useGetHistorySearchQuery } from '@/services/authService';
import { useSearchByQueryQuery } from '@/services/guardService';
import { addSearch, clearSearches, removeSearch, selectRecentSearches } from '@/store/SearchSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecentSearch from '../components/Search/RecentSearch';
import SearchInput from '../components/Search/SearchInput';
import SearchSkeleton from '../components/Search/SearchSkeleton';
import SearchSuggestions from '../components/Search/SearchSuggestions';
import TrendingSearch from '../components/Search/TrendingSearch';
import { TrendingKeyword } from '../components/Search/types';


const MOCK_TRENDING: TrendingKeyword[] = [
    { id: '1', keyword: 'iPhone 15' },
    { id: '2', keyword: 'Sneakers' },
    { id: '3', keyword: 'Maquillage' },
    { id: '4', keyword: 'Montres Luxe' },
    { id: '5', keyword: 'Gaming' },
];

const SearchScreen = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState('');
    const recentSearches = useAppSelector(selectRecentSearches);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 800);

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    // Timeout pour sauvegarder automatiquement la recherche après 2 secondes d'inactivité
    useEffect(() => {
        const historyTimer = setTimeout(() => {
            if (query.trim()) {
                handleSubmitSearch(query);
            }
        }, 2000);

        return () => {
            clearTimeout(historyTimer);
        };
    }, [query, handleSubmitSearch]);

    const { data, isLoading } = useSearchByQueryQuery(
        { query: debouncedQuery, userId: 0 },
        { skip: debouncedQuery === '' }
    );

    const handleSubmitSearch = useCallback((keyword: string) => {
        if (keyword.trim()) {
            dispatch(addSearch(keyword));
        }
    }, [dispatch]);

    const handleClearRecent = useCallback(() => {
        dispatch(clearSearches());
    }, [dispatch]);

    const handleRemoveRecent = useCallback((id: string) => {
        dispatch(removeSearch(id));
    }, [dispatch]);

    const handleSelectKeyword = useCallback((keyword: string) => {
        setQuery(keyword);
        handleSubmitSearch(keyword);
    }, [handleSubmitSearch]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <SearchInput
                value={query}
                onChangeText={setQuery}
                onSubmit={handleSubmitSearch}
            />

            <View style={styles.content}>
                {query.length === 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <RecentSearch
                            searches={recentSearches}
                            onSelect={handleSelectKeyword}
                            onClearAll={handleClearRecent}
                            onRemove={handleRemoveRecent}
                        />
                        <TrendingSearch
                            keywords={MOCK_TRENDING}
                            onSelect={handleSelectKeyword}
                        />
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1 }}>
                        {isLoading ? (
                            <SearchSkeleton />
                        ) : (
                            <SearchSuggestions
                                suggestions={data}
                                onSelect={handleSelectKeyword}
                            />
                        )}
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchScreen;
