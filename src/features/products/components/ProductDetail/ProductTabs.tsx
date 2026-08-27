import { COLORS } from "@/constants/colors";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/hooks";
import { useRedirectToLogin } from "@/hooks/useRedirectToLogin";
import { useMakeReviewMutation } from "@/services/authService";
import { useGetListReviewsQuery } from "@/services/guardService";
import { MapPin, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  productId?: number;
  description: string;
  reviews?: any[];
  reviewCount?: number;
  rating?: number;
  residence?: string;
  productUrl?: string;
};

const ProductTabs = ({
  productId,
  productUrl,
  description,
  reviews = [],
  reviewCount = 0,
  rating = 0,
  residence,
}: Props) => {
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "location"
  >("description");
  const [showAllDescription, setShowAllDescription] = useState(false);

  const { data: reviewsData } = useGetListReviewsQuery(productId, {
    skip: !productId,
  });
  const [makeReview, { isLoading: isSubmitting }] = useMakeReviewMutation();
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { redirectToLogin } = useRedirectToLogin();

  console.log(reviewsData);
  const actualReviews = reviewsData?.data || reviewsData || reviews || [];
  const actualReviewCount = Array.isArray(actualReviews)
    ? actualReviews.length
    : reviewCount;

  const handleSubmitReview = async () => {
    if (!productId || !reviewComment.trim()) return;
    if (!isAuthenticated) {
      Toast.show({
        type: "info",
        text1: "Connexion requise",
        text2: "Veuillez vous connecter pour publier un avis.",
      });
      redirectToLogin({
        redirectUrl: `/(navigation)/product/${productUrl}`,
        s: "1",
      });
      return;
    }

    const formData = new FormData();
    formData.append("comment", reviewComment);
    formData.append("rating", reviewRating.toString());

    try {
      const response = await makeReview({ formData, productId }).unwrap();
      setReviewComment("");
      setReviewRating(5);
      Toast.show({
        type: "success",
        text1: "Avis ajouté",
        text2: "Merci pour votre retour !",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible d'ajouter votre avis pour le moment.",
      });
    }
  };
  const renderDescription = () => (
    <View style={styles.tabContent}>
      <Text style={styles.descriptionText}>
        {showAllDescription
          ? description
          : description.slice(0, 100) ||
            "Aucune description disponible pour ce produit."}
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

  const renderAddReview = () => (
    <View style={styles.addReviewContainer}>
      <Text style={styles.addReviewTitle}>Laisser un avis</Text>
      <View style={styles.ratingInputRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
            <Star
              size={28}
              color={star <= reviewRating ? "#F1C40F" : "#E5E7EB"}
              fill={star <= reviewRating ? "#F1C40F" : "none"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        placeholder="Partagez votre expérience avec ce produit..."
        multiline
        numberOfLines={4}
        value={reviewComment}
        onChangeText={setReviewComment}
        placeholderTextColor="#9CA3AF"
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!reviewComment.trim() || isSubmitting) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmitReview}
        disabled={isSubmitting || !reviewComment.trim()}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Publier mon avis</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {renderAddReview()}

      {actualReviews.length > 0 ? (
        actualReviews.map((review: any, index: number) => (
          <View key={index} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>
                {review.user_name || review.user?.name || "Client anonyme"}
              </Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    color={star <= (review.rating || 0) ? "#F1C40F" : "#E5E7EB"}
                    fill={star <= (review.rating || 0) ? "#F1C40F" : "none"}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>{review.comment}</Text>
            <Text style={styles.reviewDate}>
              {review.date || review.created_at
                ? new Date(review.created_at).toLocaleDateString()
                : "Récemment"}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyReviews}>
          <Star size={40} color="#E5E7EB" strokeWidth={1} />
          <Text style={styles.emptyReviewsText}>
            Aucun avis pour le moment.
          </Text>
          <Text style={styles.emptyReviewsSubtext}>
            Soyez le premier à donner votre avis !
          </Text>
        </View>
      )}
    </View>
  );

  const renderLocation = () => (
    <View style={styles.tabContent}>
      {residence ? (
        <View style={styles.locationContainer}>
          <MapPin size={20} color="#4B5563" />
          <Text style={styles.descriptionText}>{residence}</Text>
        </View>
      ) : (
        <Text style={styles.descriptionText}>
          Aucune localisation disponible pour ce produit.
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "description" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("description")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "description" && styles.activeTabLabel,
            ]}
          >
            Description
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "reviews" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("reviews")}
        >
          <View style={styles.labelWithBadge}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === "reviews" && styles.activeTabLabel,
              ]}
            >
              Avis
            </Text>
            {actualReviewCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{actualReviewCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "location" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("location")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "location" && styles.activeTabLabel,
            ]}
          >
            Localisation
          </Text>
        </TouchableOpacity>

        
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === "description"
          ? renderDescription()
          : activeTab === "reviews"
            ? renderReviews()
            : activeTab === "location"
              ? renderLocation()
              : (
                  null
              )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderTopWidth: 8,
    paddingBottom: 20,
    borderTopColor: "#F9FAFB",
  },
  tabHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tabButton: {
    paddingVertical: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary || "#6366F1",
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
  },
  activeTabLabel: {
    color: "#1A1A1A",
  },
  labelWithBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },
  contentContainer: {
    padding: 20,
  },
  tabContent: {
    minHeight: 100,
  },
  descriptionText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  ratingRow: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: "#6366F1",
    marginTop: 8,
  },
  emptyReviews: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyReviewsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  emptyReviewsSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  addReviewContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  ratingInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  reviewInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#111827",
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary || "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default React.memo(ProductTabs);
