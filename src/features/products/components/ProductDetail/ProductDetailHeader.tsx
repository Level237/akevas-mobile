import Cart from "@/components/common/Cart";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectIsFavorite, toggleFavorite } from "@/store/FavoriteSlice";
import { Product } from "@/types/product";
import { useNavigation } from "expo-router";
import { ChevronLeft, Heart, Share2 } from "lucide-react-native";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  product: Product;
  selectedVariation?: any;
};

const ProductDetailHeader = ({ product, selectedVariation }: Props) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(
    selectIsFavorite(product, selectedVariation),
  );

  // Contracter le nom du produit à 6 caractères
  const title = product?.product_name || "Produit";
  const truncatedTitle =
    title.length > 6 ? title.substring(0, 20) + "..." : title;

  const handleShare = async () => {
    try {
      // 1. Générer l'URL profonde (Deep Link)
      // Cela créera : akevas://product/123 (en dev) ou https://akevas.com/product/123 (en prod si configuré)
      // Note: Adapte le chemin selon ton arborescence réelle, ex: `/(navigation)/product/${product.product_url}`
      const url = `https://akevas.com/produit/${product.product_url}`;

      const message = `Découvre ce produit incroyable sur Akevas ! 👀\n\n${url}`;

      // 2. Utiliser l'API Share native de React Native (C'est celle qu'il faut pour les liens !)
      const result = await Share.share({
        message: message,
        url: url, // Propriété spécifique pour iOS qui améliore l'aperçu du lien
        title: "Partager un produit Akevas",
      });

      // 3. Gérer le résultat (optionnel mais recommandé pour le tracking)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Partagé via : ${result.activityType}`); // ex: "com.apple.UIKit.activity.CopyToPasteboard"
        } else {
          console.log("Produit partagé avec succès");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Partage annulé par l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      // Optionally, you can add an Alert here if needed, but since we are in the header, console.error is fine
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite({ product, selectedVariation }));
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* LEFT: Back Button */}
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={28} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* CENTER: Truncated Title */}
        <View style={styles.centerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {truncatedTitle}
          </Text>
        </View>

        {/* RIGHT: Actions (Share, Favorite, Cart) */}
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Share2 size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleToggleFavorite}
          >
            <Heart
              size={22}
              color={isFavorite ? "#EF4444" : "#1A1A1A"}
              fill={isFavorite ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
          <Cart />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  leftContainer: {
    width: 60,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 6,
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  cartContainer: {
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
    textAlign: "center",
  },
});

export default ProductDetailHeader;
