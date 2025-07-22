import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { friendsService } from "../services/friendsService";
import { tokenStorage } from "../services/tokenStorage";
import { SearchUser, usersService } from "../services/usersService";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [friendRequestsInProgress, setFriendRequestsInProgress] = useState<
    Set<string>
  >(new Set());
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    currentPage: 1,
    hasMore: true,
  });

  useEffect(() => {
    // Recherche automatique après 500ms de pause dans la saisie
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch(searchQuery.trim());
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setSearchStats({ totalResults: 0, currentPage: 1, hasMore: true });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async (query: string, page = 1) => {
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      const token = await tokenStorage.getToken();
      if (!token) return;

      console.log("🔍 Starting search for:", query);
      const result = await usersService.searchUsers(token, query, page, 20);

      if (result.success && result.data) {
        if (page === 1) {
          setSearchResults(result.data);
        } else {
          setSearchResults((prev) => [...prev, ...(result.data || [])]);
        }

        setSearchStats({
          totalResults: result.data.length,
          currentPage: page,
          hasMore: result.data.length === 20, // Si on reçoit 20 résultats, il y en a peut-être plus
        });

        console.log("✅ Search completed:", result.data.length, "results");
      } else {
        console.log("❌ Search failed:", result.message);
        if (page === 1) {
          setSearchResults([]);
          setSearchStats({ totalResults: 0, currentPage: 1, hasMore: false });
        }
      }
    } catch (error) {
      console.log("💥 Search error:", error);
      if (page === 1) {
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (userId: string, userAlias: string) => {
    try {
      // Marquer la demande comme en cours
      setFriendRequestsInProgress((prev) => new Set([...prev, userId]));

      const token = await tokenStorage.getToken();
      if (!token) return;

      console.log("👥 Sending friend request to:", userAlias);
      const result = await friendsService.addFriend(token, userId);

      if (result.success) {
        Alert.alert(
          "Demande envoyée",
          `Votre demande d'amitié a été envoyée à @${userAlias}`
        );
        console.log("✅ Friend request sent successfully");
      } else {
        Alert.alert(
          "Erreur",
          result.message || "Impossible d'envoyer la demande d'amitié"
        );
        console.log("❌ Friend request failed:", result.message);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue");
      console.log("💥 Friend request error:", error);
    } finally {
      // Retirer la demande des demandes en cours
      setFriendRequestsInProgress((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleViewProfile = (user: SearchUser) => {
    Alert.alert(
      `Profil de @${user.alias}`,
      `${user.description || "Aucune description"}\n\nPays: ${user.pays || "Non spécifié"}\nLangue: ${user.langue || "Non spécifiée"}\n\nFonctionnalité de consultation complète en cours de développement.`
    );
  };

  const handleLoadMore = () => {
    if (searchQuery.trim() && searchStats.hasMore && !isSearching) {
      handleSearch(searchQuery.trim(), searchStats.currentPage + 1);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    if (searchQuery.trim()) {
      await handleSearch(searchQuery.trim(), 1);
    }
    setIsRefreshing(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchStats({ totalResults: 0, currentPage: 1, hasMore: true });
  };

  return (
    <View className="flex-1 bg-primary-bg">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#F5C74D"
              colors={["#F5C74D"]}
            />
          }
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6 bg-primary-bg">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-primary-text text-2xl font-bold">
                Rechercher
              </Text>
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} className="p-2">
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#7A7A8A"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Bar */}
            <View className="bg-surface-elevated rounded-[15px] flex-row items-center px-4 py-3 mb-6 border border-border-subtle">
              <Ionicons name="search" size={20} color="#A3A3B4" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher des utilisateurs..."
                placeholderTextColor="#7A7A8A"
                className="flex-1 ml-3 text-text-primary text-base"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {isSearching && (
                <Ionicons name="refresh" size={20} color="#A3A3B4" />
              )}
            </View>

            {/* Search Stats */}
            {searchResults.length > 0 && (
              <View className="flex-row justify-around mb-6">
                <View className="items-center">
                  <Text className="text-text-primary text-lg font-bold">
                    {searchResults.length}
                  </Text>
                  <Text className="text-text-secondary text-xs opacity-70">
                    Résultats
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-text-primary text-lg font-bold">
                    {searchQuery.length}
                  </Text>
                  <Text className="text-text-secondary text-xs opacity-70">
                    Caractères
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-text-primary text-lg font-bold">
                    {searchStats.currentPage}
                  </Text>
                  <Text className="text-text-secondary text-xs opacity-70">
                    Page
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Content Sections */}
          <View className="px-6 py-4">
            {/* Search Instructions */}
            {searchQuery.length === 0 && (
              <View className="items-center py-12">
                <Ionicons name="people-outline" size={64} color="#A3A3B4" />
                <Text className="text-text-secondary text-center mt-4 text-lg font-semibold">
                  Trouvez de nouveaux amis
                </Text>
                <Text className="text-text-muted text-center mt-2 opacity-70">
                  Tapez au moins 2 caractères pour commencer la recherche
                </Text>

                <View className="bg-surface-elevated rounded-[15px] p-4 mt-6 w-full border border-border-subtle">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="bulb" size={20} color="#A3A3B4" />
                    <Text className="text-text-primary font-semibold ml-2">
                      Conseils de recherche
                    </Text>
                  </View>
                  <Text className="text-text-secondary text-sm leading-5">
                    • Recherchez par pseudo (@utilisateur){"\n"}• Utilisez des
                    mots-clés simples{"\n"}• La recherche est automatique{"\n"}•
                    Tirez vers le bas pour actualiser
                  </Text>
                </View>
              </View>
            )}

            {/* Search too short */}
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <View className="items-center py-8">
                <Ionicons name="text-outline" size={48} color="#7A7A8A" />
                <Text className="text-text-muted text-center mt-3">
                  Tapez au moins 2 caractères
                </Text>
              </View>
            )}

            {/* Loading State */}
            {isSearching && searchResults.length === 0 && (
              <View className="items-center py-8">
                <Ionicons name="refresh" size={48} color="#A3A3B4" />
                <Text className="text-text-secondary text-center mt-3 font-medium">
                  Recherche en cours...
                </Text>
              </View>
            )}

            {/* No Results */}
            {searchQuery.length >= 2 &&
              !isSearching &&
              searchResults.length === 0 && (
                <View className="items-center py-8">
                  <Ionicons name="search-outline" size={48} color="#7A7A8A" />
                  <Text className="text-text-muted text-center mt-3 font-medium">
                    Aucun résultat pour "{searchQuery}"
                  </Text>
                  <Text className="text-text-disabled text-center mt-1 opacity-70">
                    Essayez avec d'autres mots-clés
                  </Text>
                </View>
              )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <View className="mb-6">
                <Text className="text-text-primary text-lg font-bold mb-4">
                  Utilisateurs trouvés
                </Text>

                {searchResults.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => handleViewProfile(user)}
                    className="bg-surface-elevated rounded-[15px] p-4 mb-3 flex-row items-center border border-border-subtle"
                  >
                    {/* Avatar */}
                    <View className="w-12 h-12 rounded-full bg-primary-bg-light items-center justify-center mr-4 border border-border-subtle">
                      {user.avatar ? (
                        <Image
                          source={{ uri: user.avatar }}
                          className="w-12 h-12 rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={20} color="#A3A3B4" />
                      )}
                    </View>

                    {/* User Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-text-primary font-bold text-base">
                          @{user.alias}
                        </Text>
                        {!user.is_public && (
                          <Ionicons
                            name="lock-closed"
                            size={14}
                            color="#7A7A8A"
                            className="ml-2"
                          />
                        )}
                      </View>

                      {user.description && (
                        <Text
                          className="text-text-secondary text-sm mb-1"
                          numberOfLines={1}
                        >
                          {user.description}
                        </Text>
                      )}

                      <View className="flex-row items-center">
                        {user.pays && (
                          <Text className="text-text-muted text-xs mr-3 font-medium">
                            📍 {user.pays}
                          </Text>
                        )}
                        {user.langue && (
                          <Text className="text-text-muted text-xs font-medium">
                            🗣️ {user.langue}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Add Friend Button */}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddFriend(user.id, user.alias);
                      }}
                      disabled={friendRequestsInProgress.has(user.id)}
                      className={`w-10 h-10 rounded-full items-center justify-center border ${
                        friendRequestsInProgress.has(user.id)
                          ? "bg-surface-pressed border-border-strong"
                          : "bg-surface-elevated border-border-strong"
                      }`}
                    >
                      {friendRequestsInProgress.has(user.id) ? (
                        <Ionicons name="refresh" size={16} color="#7A7A8A" />
                      ) : (
                        <Ionicons name="person-add" size={16} color="#C4C4D1" />
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}

                {/* Load More Button */}
                {searchStats.hasMore && !isSearching && (
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    className="bg-surface-elevated rounded-[15px] p-4 items-center border border-border-subtle"
                  >
                    <Ionicons name="chevron-down" size={20} color="#A3A3B4" />
                    <Text className="text-text-secondary font-semibold mt-1">
                      Charger plus de résultats
                    </Text>
                  </TouchableOpacity>
                )}

                {/* End of Results */}
                {!searchStats.hasMore && searchResults.length > 0 && (
                  <View className="items-center py-4">
                    <Text className="text-text-disabled text-sm opacity-70">
                      Fin des résultats
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
