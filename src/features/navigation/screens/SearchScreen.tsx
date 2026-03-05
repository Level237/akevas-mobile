import { COLORS } from '@/constants/colors';
import { useGetHistorySearchQuery } from '@/services/authService';
import { useSearchByQueryQuery } from '@/services/guardService';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecentSearch from '../components/Search/RecentSearch';
import SearchInput from '../components/Search/SearchInput';
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
    const [query, setQuery] = useState('');

    const { data: history, isLoading: isLoadingSearch } = useGetHistorySearchQuery('auth')
    const [recentSearches, setRecentSearches] = useState<any[]>(history || []);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 800);

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    const { data, isLoading } = useSearchByQueryQuery(
        { query: debouncedQuery, userId: 0 },
        { skip: debouncedQuery === '' }
    );

    const handleClearRecent = useCallback(() => {
        setRecentSearches([]);
    }, []);

    const handleSelectKeyword = useCallback((keyword: string) => {
        setQuery(keyword);
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <SearchInput
                value={query}
                onChangeText={setQuery}
            />

            <View style={styles.content}>
                {query.length === 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <RecentSearch
                            searches={recentSearches}
                            onSelect={handleSelectKeyword}
                            onClearAll={handleClearRecent}
                        />
                        <TrendingSearch
                            keywords={MOCK_TRENDING}
                            onSelect={handleSelectKeyword}
                        />
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1 }}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
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
