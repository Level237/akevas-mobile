import { COLORS } from '@/constants/colors';
import { useGetCategoriesQuery } from '@/services/guardService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type CategoryCardProps = {
    item: any;
    isSelected: boolean;
    onPress: () => void;
};

const CategoryCard = ({ item, isSelected, onPress }: CategoryCardProps) => {
    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >

            <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                {item.category_name}
            </Text>
        </TouchableOpacity>
    );
};

export default function UpdatePreferencesScreen() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const insets = useSafeAreaInsets();

    const { data: categories, isLoading } = useGetCategoriesQuery("guard");

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const stored = await SecureStore.getItemAsync('USER_PREFERENCES');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        setSelectedIds(parsed);
                    }
                }
            } catch (error) {
                console.error("Error loading preferences:", error);
            }
        };
        loadPreferences();
    }, []);

    const toggleCategory = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await SecureStore.setItemAsync('USER_PREFERENCES', JSON.stringify(selectedIds));
            // Feedback to the user
            Alert.alert("Succès", "Vos préférences ont été mises à jour.", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error("Error saving preferences:", error);
            Alert.alert("Erreur", "Impossible de sauvegarder vos préférences.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mes Préférences</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.subText}>
                    Mettez à jour vos centres d'intérêt pour une meilleure personnalisation des produits.
                </Text>

                {/* Category Grid */}
                <View style={styles.grid}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        categories?.categories?.map((item: any) => (
                            <CategoryCard
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.includes(item.id)}
                                onPress={() => toggleCategory(item.id)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    headerRight: {
        width: 32, // to balance the back button width
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    subText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.surface, // Using surface as border by default so it has same size
        minWidth: (width - 52) / 2, // 2 columns with gap (20*2 padding + 12 gap = 52)
    },
    cardSelected: {
        backgroundColor: '#FFF7ED', // Light orange background
        borderColor: COLORS.primary,
    },
    cardText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 10,
    },
    cardTextSelected: {
        color: COLORS.primary,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.surface,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
