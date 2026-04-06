import { useAddShopReviewMutation, useGetListShopReviewsQuery } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const COLORS = {
    primary: '#E67E22',
    secondary: '#FF6B00',
    star: '#FFD700',
    text: '#333',
    lightText: '#666',
    border: '#F0F0F0',
    background: '#F8F8F8',
    card: '#FFF',
    error: '#E74C4C'
};

type ShopReviewsProps = {
    shopId: number | string;
    shopData: any;
};

const ShopReviews = ({ shopId, shopData }: ShopReviewsProps) => {
    const { data: reviewsData, isLoading, refetch } = useGetListShopReviewsQuery(shopId);
    const [addReview, { isLoading: isSubmitting }] = useAddShopReviewMutation();
    console.log(reviewsData);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const reviews = reviewsData || [];

    // Calculate rating stats
    const stats = useMemo(() => {
        if (reviews.length === 0) return { average: 0, count: 0, breakdown: [0, 0, 0, 0, 0] };

        const breakdown = [0, 0, 0, 0, 0];
        let total = 0;

        reviews.forEach((r: any) => {
            const rRating = Math.round(r.rating || 0);
            if (rRating >= 1 && rRating <= 5) {
                breakdown[rRating - 1]++;
                total += rRating;
            }
        });

        return {
            average: (total / reviews.length).toFixed(1),
            count: reviews.length,
            breakdown: breakdown.reverse() // 5 to 1
        };
    }, [reviews]);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Attention', 'Veuillez sélectionner une note.');
            return;
        }
        if (!comment.trim()) {
            Alert.alert('Attention', 'Veuillez ajouter un commentaire.');
            return;
        }

        try {
            await addReview({
                shop_id: shopId,
                rating: rating,
                comment: comment
            }).unwrap();

            Alert.alert('Merci !', 'Votre avis a été ajouté avec succès.');
            setRating(0);
            setComment('');
            refetch();
        } catch (error) {
        }
    }

    const renderReviewItem = ({ item }: { item: any }) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>{item.user_name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={styles.reviewInfo}>
                    <Text style={styles.userName}>{item.user_name || 'Utilisateur'}</Text>
                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Ionicons
                                key={s}
                                name={s <= item.rating ? 'star' : 'star-outline'}
                                size={14}
                                color={COLORS.star}
                            />
                        ))}
                        <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Rating Summary */}
            <View style={styles.summarySection}>
                <View style={styles.averageContainer}>
                    <Text style={styles.averageValue}>{stats.average}</Text>
                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Ionicons
                                key={s}
                                name={s <= Math.round(Number(stats.average)) ? 'star' : 'star-outline'}
                                size={18}
                                color={COLORS.star}
                            />
                        ))}
                    </View>
                    <Text style={styles.totalReviews}>{stats.count} avis</Text>
                </View>
                <View style={styles.breakdownContainer}>
                    {stats.breakdown.map((count, index) => {
                        const starLevel = 5 - index;
                        const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                        return (
                            <View key={starLevel} style={styles.breakdownRow}>
                                <Text style={styles.starLevelText}>{starLevel}</Text>
                                <View style={styles.progressBg}>
                                    <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Write a Review */}
            <View style={styles.formSection}>
                <Text style={styles.sectionSubtitle}>Laissez un avis</Text>
                <View style={styles.interactiveStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <TouchableOpacity key={s} onPress={() => setRating(s)}>
                            <Ionicons
                                name={s <= rating ? 'star' : 'star-outline'}
                                size={32}
                                color={COLORS.star}
                                style={styles.starIcon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Partagez votre expérience avec cette boutique..."
                    placeholderTextColor={COLORS.lightText}
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Publier mon avis</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Reviews List */}
            <Text style={styles.sectionSubtitle}>Derniers avis</Text>
            {reviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubbles-outline" size={48} color={COLORS.lightText} />
                    <Text style={styles.emptyText}>Aucun avis disponible pour cette boutique.</Text>
                    <Text style={styles.emptySubText}>Soyez le premier à donner votre avis !</Text>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={renderReviewItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false} // Since it's inside a ScrollView/SectionList
                    contentContainerStyle={styles.reviewList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    centerContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summarySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    averageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 20,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
    },
    averageValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    totalReviews: {
        fontSize: 12,
        color: COLORS.lightText,
        marginTop: 4,
    },
    breakdownContainer: {
        flex: 1.5,
        paddingLeft: 20,
        gap: 6,
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    starLevelText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.text,
        width: 10,
    },
    progressBg: {
        flex: 1,
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    sectionSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
        marginTop: 10,
    },
    formSection: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 25,
        marginBottom: 20,
    },
    interactiveStars: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 12,
    },
    starIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    commentInput: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 15,
        fontSize: 14,
        color: COLORS.text,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewList: {
        gap: 15,
    },
    reviewCard: {
        backgroundColor: COLORS.background,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: COLORS.lightText,
        marginLeft: 8,
    },
    reviewComment: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 10,
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.text,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 13,
        color: COLORS.lightText,
        textAlign: 'center',
    },
});

export default ShopReviews;
