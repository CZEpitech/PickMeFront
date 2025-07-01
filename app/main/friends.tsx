import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { ScreenWrapper } from "../components";
import { useFriends, useUserSearch } from "../hooks";

export default function FriendsScreen() {
  const {
    friends,
    friendRequests,
    loading,
    refreshing,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    refreshData,
    getFriendsCount,
    getPendingRequestsCount,
  } = useFriends();

  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
    searchQuery,
    setSearchQuery,
    searchUsers,
    clearSearch,
    hasSearched,
  } = useUserSearch();

  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search">(
    "friends"
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      await searchUsers(query);
    } else if (query.length === 0) {
      clearSearch();
    }
  };

  const handleSendFriendRequest = async (userId: string, alias: string) => {
    const success = await sendFriendRequest(userId);
    if (success) {
      Alert.alert("Succès", `Demande d'amitié envoyée à ${alias}`);
    }
  };

  const handleAcceptRequest = async (requestId: string, alias: string) => {
    const success = await acceptFriendRequest(requestId);
    if (success) {
      Alert.alert("Succès", `${alias} est maintenant votre ami !`);
    }
  };

  const handleRejectRequest = async (requestId: string, alias: string) => {
    Alert.alert(
      "Rejeter la demande",
      `Êtes-vous sûr de vouloir rejeter la demande de ${alias} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Rejeter",
          style: "destructive",
          onPress: async () => {
            const success = await rejectFriendRequest(requestId);
            if (success) {
              Alert.alert("Info", "Demande rejetée");
            }
          },
        },
      ]
    );
  };

  const handleRemoveFriend = async (friendId: string, alias: string) => {
    Alert.alert(
      "Supprimer l'ami",
      `Êtes-vous sûr de vouloir supprimer ${alias} de vos amis ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await removeFriend(friendId);
            if (success) {
              Alert.alert("Info", `${alias} a été supprimé de vos amis`);
            }
          },
        },
      ]
    );
  };

  const getInitials = (alias: string) => {
    return alias.substring(0, 2).toUpperCase();
  };

  const renderAvatar = (avatar?: string, alias: string = "U") => {
    if (avatar) {
      return (
        <Image
          source={{ uri: avatar }}
          className="w-12 h-12 rounded-full"
          onError={() => console.log("❌ Avatar failed to load")}
        />
      );
    }
    return (
      <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
        <Text className="text-black text-lg font-bold">
          {getInitials(alias)}
        </Text>
      </View>
    );
  };

  const renderSearchResults = () => {
    // État de chargement pendant la recherche
    if (searchLoading) {
      return (
        <View className="items-center py-8">
          <Text className="text-text-muted">Recherche en cours...</Text>
        </View>
      );
    }

    // Affichage des erreurs de recherche
    if (searchError) {
      return (
        <View className="items-center py-8">
          <Text className="text-red-500 text-center">{searchError}</Text>
        </View>
      );
    }

    // Si on a fait une recherche mais aucun résultat
    if (hasSearched && searchResults.length === 0) {
      return (
        <View className="items-center py-8">
          <Ionicons name="search" size={48} color="#8E8E93" />
          <Text className="text-text-muted text-center mt-4">
            Aucun utilisateur trouvé pour "{searchQuery}"
          </Text>
        </View>
      );
    }

    // Si on a des résultats de recherche
    if (hasSearched && searchResults.length > 0) {
      return (
        <View className="px-4">
          {/* Titre de section */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary font-semibold text-lg">
              Résultats de recherche
            </Text>
          </View>

          {searchResults.map((user) => (
            <View
              key={user.id}
              className="flex-row items-center justify-between p-4 mb-3 bg-background-tertiary rounded-xl"
            >
              <View className="flex-row items-center flex-1">
                {renderAvatar(user.avatar, user.alias)}
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary font-semibold text-base">
                    {user.alias}
                  </Text>
                  {user.description && (
                    <Text
                      className="text-text-muted text-sm mt-1"
                      numberOfLines={1}
                    >
                      {user.description}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleSendFriendRequest(user.id, user.alias)}
                className="bg-primary rounded-full px-4 py-2 ml-3"
              >
                <Text className="text-black font-semibold text-sm">
                  Ajouter
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Indicateur du nombre d'utilisateurs affichés */}
          <Text className="text-text-muted text-center text-xs mt-4 mb-8">
            {`${searchResults.length} résultat${searchResults.length > 1 ? "s" : ""} trouvé${searchResults.length > 1 ? "s" : ""}`}
          </Text>
        </View>
      );
    }

    // État par défaut : inviter à effectuer une recherche
    return (
      <View className="items-center py-8 px-8">
        <Ionicons name="search" size={64} color="#8E8E93" />
        <Text className="text-text-primary text-xl font-bold text-center mt-6 mb-4">
          Rechercher des utilisateurs
        </Text>
        <Text className="text-text-muted text-center">
          Utilisez la barre de recherche ci-dessus pour trouver des utilisateurs
          par leur nom d'utilisateur.
        </Text>
      </View>
    );
  };

  const renderFriendRequests = () => {
    if (friendRequests.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-24 h-24 rounded-full bg-background-tertiary items-center justify-center mb-6">
            <Ionicons name="mail" size={48} color="#8E8E93" />
          </View>
          <Text className="text-text-primary text-xl font-bold text-center mb-4">
            Aucune demande d'amitié
          </Text>
          <Text className="text-text-muted text-center text-base">
            Vous n'avez pas de nouvelles demandes d'amitié.
          </Text>
        </View>
      );
    }

    return (
      <View className="px-4">
        {friendRequests.map((request) => (
          <View
            key={request.id}
            className="flex-row items-center justify-between p-4 mb-3 bg-background-tertiary rounded-xl"
          >
            <View className="flex-row items-center flex-1">
              {renderAvatar(request.from_user.avatar, request.from_user.alias)}
              <View className="ml-3 flex-1">
                <Text className="text-text-primary font-semibold text-base">
                  {request.from_user.alias}
                </Text>
                <Text className="text-text-muted text-sm mt-1">
                  Demande d'amitié
                </Text>
              </View>
            </View>
            <View className="flex-row ml-3">
              <TouchableOpacity
                onPress={() =>
                  handleAcceptRequest(request.id, request.from_user.alias)
                }
                className="bg-green-500 rounded-full p-2 mr-2"
              >
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleRejectRequest(request.id, request.from_user.alias)
                }
                className="bg-red-500 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderFriendsList = () => {
    if (friends.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-24 h-24 rounded-full bg-background-tertiary items-center justify-center mb-6">
            <Ionicons name="people" size={48} color="#8E8E93" />
          </View>
          <Text className="text-text-primary text-xl font-bold text-center mb-4">
            Aucun ami pour le moment
          </Text>
          <Text className="text-text-muted text-center text-base mb-6">
            Recherchez des utilisateurs pour commencer à vous faire des amis !
          </Text>
          <TouchableOpacity
            onPress={() => setActiveTab("search")}
            className="bg-primary rounded-full px-6 py-3"
          >
            <Text className="text-black font-semibold">Chercher des amis</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="px-4">
        {friends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            onPress={() => handleRemoveFriend(friend.id, friend.alias)}
            className="flex-row items-center justify-between p-4 mb-3 bg-background-tertiary rounded-xl"
          >
            <View className="flex-row items-center flex-1">
              {renderAvatar(friend.avatar, friend.alias)}
              <View className="ml-3 flex-1">
                <Text className="text-text-primary font-semibold text-base">
                  {friend.alias}
                </Text>
                <Text className="text-text-muted text-sm mt-1">
                  {friend.is_online ? "En ligne" : "Hors ligne"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTabButton = (
    tab: "friends" | "requests" | "search",
    title: string,
    icon: string,
    badge?: number
  ) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full mr-2 ${
        activeTab === tab ? "bg-primary" : "bg-background-tertiary"
      }`}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={activeTab === tab ? "black" : "white"}
        style={{ marginRight: 6 }}
      />
      <Text
        className={`font-semibold text-sm ${
          activeTab === tab ? "text-black" : "text-white"
        }`}
      >
        {title}
        {badge !== undefined && badge > 0 && <Text> ({badge})</Text>}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 border-b border-border-primary">
        <Text className="text-text-primary text-xl font-bold">Amis</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row p-4">
        {renderTabButton("friends", "Amis", "people", getFriendsCount())}
        {renderTabButton(
          "requests",
          "Demandes",
          "mail",
          getPendingRequestsCount()
        )}
        {renderTabButton("search", "Rechercher", "search")}
      </View>

      {/* Search Bar (only visible in search tab) */}
      {activeTab === "search" && (
        <View className="px-4 pb-4">
          <View className="flex-row items-center bg-background-tertiary rounded-xl px-4 py-3">
            <Ionicons
              name="search"
              size={20}
              color="#8E8E93"
              style={{ marginRight: 12 }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Rechercher des utilisateurs..."
              placeholderTextColor="#8E8E93"
              className="flex-1 text-text-primary text-base"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="ml-2">
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View className="mx-4 mb-4 p-3 bg-red-500 bg-opacity-20 rounded-xl">
          <Text className="text-red-500 text-center text-sm">{error}</Text>
        </View>
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || searchLoading}
            onRefresh={() => {
              refreshData();
            }}
          />
        }
      >
        {activeTab === "friends" && renderFriendsList()}
        {activeTab === "requests" && renderFriendRequests()}
        {activeTab === "search" && renderSearchResults()}
      </ScrollView>
    </ScreenWrapper>
  );
}
