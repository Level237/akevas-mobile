import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Props = {
  onBack: () => void;
  onFilterPress?: () => void;
  onSearchChange?: (text: string) => void;
  activeFiltersCount?: number;
};

const ExploreHeader = ({ onBack, onFilterPress, onSearchChange, activeFiltersCount }: Props) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(navigation)/search")}
        style={styles.searchContainer}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          onPress={() => router.push("/(navigation)/search")}
          style={styles.input}
          placeholder="Rechercher un produit..."
          placeholderTextColor="#999"
          onChangeText={onSearchChange}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <Ionicons name="options-outline" size={20} color="#333" />
        {activeFiltersCount !== undefined && activeFiltersCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFiltersCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F97316',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ExploreHeader;
