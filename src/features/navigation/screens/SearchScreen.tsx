import React, { useCallback, useMemo, useState } from 'react';
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
import SearchSuggestions from '../components/Search/SearchSuggestions';
import TrendingSearch from '../components/Search/TrendingSearch';
import { RecentSearch as RecentType, SearchSuggestion, TrendingKeyword } from '../components/Search/types';

// Mock Data
const MOCK_RECENT_SEARCHES: RecentType[] = [
    { id: '1', keyword: 'Chaussures de sport' },
    { id: '2', keyword: 'Robes été' },
    { id: '3', keyword: 'Sac à main cuir' },
];

const MOCK_TRENDING: TrendingKeyword[] = [
    { id: '1', keyword: 'iPhone 15' },
    { id: '2', keyword: 'Sneakers' },
    { id: '3', keyword: 'Maquillage' },
    { id: '4', keyword: 'Montres Luxe' },
    { id: '5', keyword: 'Gaming' },
];

const MOCK_SUGGESTIONS: SearchSuggestion[] = [
    { id: '1', text: 'Chaussures Nike' },
    { id: '2', text: 'Chaussures Adidas' },
    { id: '3', text: 'Chaussures de ville' },
    { id: '4', text: 'Chaussures randonnée' },
];

const SearchScreen = () => {
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<RecentType[]>(MOCK_RECENT_SEARCHES);

    const filteredSuggestions = useMemo(() => {
        if (!query) return [];
        return MOCK_SUGGESTIONS.filter(s =>
            s.text.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const handleClearRecent = useCallback(() => {
        setRecentSearches([]);
    }, []);

    const handleSelectKeyword = useCallback((keyword: string) => {
        setQuery(keyword);
        // Here we would normally trigger the actual search
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
                    <SearchSuggestions
                        suggestions={filteredSuggestions}
                        onSelect={handleSelectKeyword}
                    />
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
});

export default SearchScreen;
