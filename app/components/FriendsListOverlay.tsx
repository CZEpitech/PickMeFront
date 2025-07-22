import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FriendFlat, friendsService } from "../services/friendsService";
import { tokenStorage } from "../services/tokenStorage";

interface FriendsListOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function FriendsListOverlay({
  visible,
  onClose,
}: FriendsListOverlayProps) {
  const [friends, setFriends] = useState<FriendFlat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (visible) {
      loadFriends(1, true);
    }
  }, [visible]);

  const loadFriends = async (page = 1, reset = false) => {
    if (isLoading && !reset) return;

    try {
      if (reset) {
        setIsLoading(true);
        setFriends([]);
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setIsLoading(true);
      }

      const token = await tokenStorage.getToken();
      if (!token) return;

      console.log("📋 Loading friends list, page:", page);
      const result = await friendsService.getFriendsList(token, "accepted", page, 20);

      if (result.success && result.data) {
        if (reset || page === 1) {
          setFriends(result.data);
        } else {
          setFriends((prev) => [...prev, ...result.data]);
        }

        setCurrentPage(page);
        setHasMore(result.data.length === 20);
        
        console.log("✅ Friends loaded:", result.data.length, "total:", reset || page === 1 ? result.data.length : friends.length + result.data.length);
      } else {
        console.log("❌ Failed to load friends:", result.message);
        if (page === 1) {
          setFriends([]);
        }
      }
    } catch (error) {
      console.log("💥 Error loading friends:", error);
      if (page === 1) {
        setFriends([]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFriends(1, true);
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      loadFriends(currentPage + 1);
    }
  };

  const handleViewProfile = (friend: FriendFlat) => {
    Alert.alert(
      `Profil de @${friend.alias}`,
      `Ami depuis le ${new Date(friend.created_at).toLocaleDateString()}\n\nFonctionnalité de consultation complète en cours de développement.`
    );
  };

  const renderFriendItem = ({ item: friend }: { item: FriendFlat }) => (
    <TouchableOpacity
      onPress={() => handleViewProfile(friend)}
      className="bg-surface-elevated rounded-[15px] p-4 mb-3 flex-row items-center border border-border-subtle"
    >
      {/* Avatar */}
      <View className="w-12 h-12 rounded-full bg-primary-bg-light items-center justify-center mr-4 border border-border-subtle">
        {friend.avatar ? (
          <Image
            source={{ uri: friend.avatar }}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person" size={20} color="#A3A3B4" />
        )}
      </View>

      {/* Friend Info */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-text-primary font-bold text-base">
            @{friend.alias}
          </Text>
          {!friend.is_public && (
            <Ionicons
              name="lock-closed"
              size={14}
              color="#7A7A8A"
              className="ml-2"
            />
          )}
        </View>

        <Text className="text-text-muted text-xs font-medium">
          ✓ Ami depuis le {new Date(friend.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Status indicator */}
      <View className="w-3 h-3 bg-green-500 rounded-full" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="items-center py-12">
      <Ionicons name="people-outline" size={64} color="#A3A3B4" />
      <Text className="text-text-secondary text-center mt-4 text-lg font-semibold">
        Aucun ami pour le moment
      </Text>
      <Text className="text-text-muted text-center mt-2 opacity-70">
        Utilisez la recherche pour trouver et ajouter des amis
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || friends.length === 0) return null;
    
    return (
      <View className="py-4 items-center">
        <Ionicons name="refresh" size={20} color="#A3A3B4" />
        <Text className="text-text-secondary text-sm mt-1">Chargement...</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top"]} className="flex-1 bg-primary-bg">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-subtle bg-primary-bg">
          <View className="flex-row items-center">
            <Text className="text-primary-text text-xl font-bold">
              Mes Amis
            </Text>
            {friends.length > 0 && (
              <View className="ml-3 bg-surface-elevated rounded-full px-3 py-1">
                <Text className="text-text-secondary text-sm font-medium">
                  {friends.length}
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 rounded-full bg-surface-elevated items-center justify-center"
          >
            <Ionicons name="close" size={20} color="#C4C4D1" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-6">
          {friends.length === 0 && !isLoading ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={friends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 16 }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor="#F5C74D"
                  colors={["#F5C74D"]}
                />
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}