import { useEffect, useState } from "react";

interface Friend {
  id: string;
  alias: string;
  avatar?: string;
  is_online?: boolean;
  last_seen?: string;
  friendship_status: "pending" | "accepted" | "blocked";
  created_at: string;
}

interface FriendRequest {
  id: string;
  from_user: {
    id: string;
    alias: string;
    avatar?: string;
  };
  to_user: {
    id: string;
    alias: string;
    avatar?: string;
  };
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

interface UseFriendsReturn {
  friends: Friend[];
  friendRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  loadFriends: () => Promise<void>;
  loadFriendRequests: () => Promise<void>;
  loadSentRequests: () => Promise<void>;
  sendFriendRequest: (userId: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  rejectFriendRequest: (requestId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  getFriendsCount: () => number;
  getPendingRequestsCount: () => number;
}

export const useFriends = (): UseFriendsReturn => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("👥 Loading friends...");
      // TODO: Implémenter l'appel API une fois que l'endpoint sera ajouté à apiService
      // const response = await apiService.getFriends();
      // if (response.success && response.data) {
      //   setFriends(response.data.friends || []);
      //   console.log("✅ Friends loaded successfully");
      // }
      console.log("🔄 Friends endpoint not implemented yet");
      setFriends([]); // Temporaire
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des amis";
      setError(errorMessage);
      console.error("❌ Error loading friends:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFriendRequests = async () => {
    setError(null);
    try {
      console.log("📨 Loading friend requests...");
      // TODO: Implémenter l'appel API
      // const response = await apiService.getFriendRequests();
      // if (response.success && response.data) {
      //   setFriendRequests(response.data.requests || []);
      //   console.log("✅ Friend requests loaded successfully");
      // }
      console.log("🔄 Friend requests endpoint not implemented yet");
      setFriendRequests([]); // Temporaire
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des demandes d'amitié";
      setError(errorMessage);
      console.error("❌ Error loading friend requests:", err);
    }
  };

  const loadSentRequests = async () => {
    setError(null);
    try {
      console.log("📤 Loading sent requests...");
      // TODO: Implémenter l'appel API
      // const response = await apiService.getSentFriendRequests();
      // if (response.success && response.data) {
      //   setSentRequests(response.data.requests || []);
      //   console.log("✅ Sent requests loaded successfully");
      // }
      console.log("🔄 Sent requests endpoint not implemented yet");
      setSentRequests([]); // Temporaire
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des demandes envoyées";
      setError(errorMessage);
      console.error("❌ Error loading sent requests:", err);
    }
  };

  const sendFriendRequest = async (userId: string): Promise<boolean> => {
    try {
      console.log(`📨 Sending friend request to user ${userId}...`);
      // TODO: Implémenter l'appel API
      // const response = await apiService.sendFriendRequest(userId);
      // if (response.success) {
      //   console.log("✅ Friend request sent successfully");
      //   await loadSentRequests(); // Recharger les demandes envoyées
      //   return true;
      // }
      console.log("🔄 Send friend request endpoint not implemented yet");
      return false;
    } catch (err) {
      console.error("❌ Error sending friend request:", err);
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      console.log(`✅ Accepting friend request ${requestId}...`);
      // TODO: Implémenter l'appel API
      // const response = await apiService.acceptFriendRequest(requestId);
      // if (response.success) {
      //   console.log("✅ Friend request accepted successfully");
      //   await Promise.all([loadFriends(), loadFriendRequests()]);
      //   return true;
      // }
      console.log("🔄 Accept friend request endpoint not implemented yet");
      return false;
    } catch (err) {
      console.error("❌ Error accepting friend request:", err);
      return false;
    }
  };

  const rejectFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      console.log(`❌ Rejecting friend request ${requestId}...`);
      // TODO: Implémenter l'appel API
      // const response = await apiService.rejectFriendRequest(requestId);
      // if (response.success) {
      //   console.log("✅ Friend request rejected successfully");
      //   await loadFriendRequests();
      //   return true;
      // }
      console.log("🔄 Reject friend request endpoint not implemented yet");
      return false;
    } catch (err) {
      console.error("❌ Error rejecting friend request:", err);
      return false;
    }
  };

  const removeFriend = async (friendId: string): Promise<boolean> => {
    try {
      console.log(`🗑️ Removing friend ${friendId}...`);
      // TODO: Implémenter l'appel API
      // const response = await apiService.removeFriend(friendId);
      // if (response.success) {
      //   console.log("✅ Friend removed successfully");
      //   await loadFriends();
      //   return true;
      // }
      console.log("🔄 Remove friend endpoint not implemented yet");
      return false;
    } catch (err) {
      console.error("❌ Error removing friend:", err);
      return false;
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    try {
      console.log(`🚫 Blocking user ${userId}...`);
      // TODO: Implémenter l'appel API
      // const response = await apiService.blockUser(userId);
      // if (response.success) {
      //   console.log("✅ User blocked successfully");
      //   await loadFriends();
      //   return true;
      // }
      console.log("🔄 Block user endpoint not implemented yet");
      return false;
    } catch (err) {
      console.error("❌ Error blocking user:", err);
      return false;
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    try {
      console.log(`✅ Unblocking user ${userId}...`);
      // TODO: Implémenter l'appel API
      // const response = await apiService.unblockUser(userId);
      // if (response.success) {
      //   console.log("✅ User unblocked successfully");
      //   return true;
      // }
      console.log("🔄 Unblock user endpoint not implemented yet");
      return false;
    } catch (err) {
      console.error("❌ Error unblocking user:", err);
      return false;
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadFriends(),
        loadFriendRequests(),
        loadSentRequests(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const getFriendsCount = (): number => {
    return friends.filter((friend) => friend.friendship_status === "accepted")
      .length;
  };

  const getPendingRequestsCount = (): number => {
    return friendRequests.filter((request) => request.status === "pending")
      .length;
  };

  // Auto-load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  return {
    friends,
    friendRequests,
    sentRequests,
    loading,
    refreshing,
    error,
    loadFriends,
    loadFriendRequests,
    loadSentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    refreshData,
    getFriendsCount,
    getPendingRequestsCount,
  };
};
