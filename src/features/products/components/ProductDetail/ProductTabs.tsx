import { COLORS } from '@/constants/colors';
import { Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    description: string;
    reviews?: any[];
    reviewCount?: number;
    rating?: number;
};

const ProductTabs = ({ description, reviews = [], reviewCount = 0, rating = 0 }: Props) => {
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [showAllDescription, setShowAllDescription] = useState(false);
    const renderDescription = () => (
        <View style={styles.tabContent}>
            <Text style={styles.descriptionText}>
                {showAllDescription ? description : description.slice(0, 100) || "Aucune description disponible pour ce produit."}

            </Text>
            {showAllDescription && (
                <TouchableOpacity onPress={() => setShowAllDescription(false)}>
                    <Text style={styles.showMoreText}>Voir moins</Text>
                </TouchableOpacity>
            )}
            {!showAllDescription && (
                <TouchableOpacity onPress={() => setShowAllDescription(true)}>
                    <Text style={styles.showMoreText}>Voir plus</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderReviews = () => (
        <View style={styles.tabContent}>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewerName}>{review.user_name || "Clientanonyme"}</Text>
                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={12}
                                        color={star <= (review.rating || 0) ? '#F1C40F' : '#E5E7EB'}
                                        fill={star <= (review.rating || 0) ? '#F1C40F' : 'none'}
                                    />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.reviewText}>{review.comment}</Text>
                        <Text style={styles.reviewDate}>{review.date || "Récemment"}</Text>
                    </View>
                ))
            ) : (
                <View style={styles.emptyReviews}>
                    <Star size={40} color="#E5E7EB" strokeWidth={1} />
                    <Text style={styles.emptyReviewsText}>Aucun avis pour le moment.</Text>
                    <Text style={styles.emptyReviewsSubtext}>Soyez le premier à donner votre avis !</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Tab Headers */}
            <View style={styles.tabHeader}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'description' && styles.activeTabButton]}
                    onPress={() => setActiveTab('description')}
                >
                    <Text style={[styles.tabLabel, activeTab === 'description' && styles.activeTabLabel]}>
                        Description
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]}
                    onPress={() => setActiveTab('reviews')}
                >
                    <View style={styles.labelWithBadge}>
                        <Text style={[styles.tabLabel, activeTab === 'reviews' && styles.activeTabLabel]}>
                            Avis
                        </Text>
                        {reviewCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{reviewCount}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.contentContainer}>
                {activeTab === 'description' ? renderDescription() : renderReviews()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderTopWidth: 8,
        paddingBottom: 20,
        borderTopColor: '#F9FAFB',
    },
    tabHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tabButton: {
        paddingVertical: 16,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabButton: {
        borderBottomColor: COLORS.primary || '#6366F1',
    },
    tabLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6B7280',
    },
    activeTabLabel: {
        color: '#1A1A1A',
    },
    labelWithBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4B5563',
    },
    contentContainer: {
        padding: 20,
    },
    tabContent: {
        minHeight: 100,
    },
    descriptionText: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,

    },
    reviewItem: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
    },
    showMoreText: {
        fontSize: 14,
        color: '#6366F1',
        marginTop: 8,
    },
    emptyReviews: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyReviewsText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginTop: 12,
    },
    emptyReviewsSubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
});

export default React.memo(ProductTabs);
