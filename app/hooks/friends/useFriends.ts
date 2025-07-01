import { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";

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
      const response = await apiService.getFriends("accepted");
      if (response.success && response.data) {
        // Gestion flexible de la structure de données
        const friendsData = response.data.friends || response.data || [];
        setFriends(Array.isArray(friendsData) ? friendsData : []);
        console.log(
          `✅ Friends loaded successfully: ${Array.isArray(friendsData) ? friendsData.length : 0} friends`
        );
      } else {
        console.log("⚠️ No friends data or unsuccessful response");
        setFriends([]);
        // Ne pas considérer cela comme une erreur si c'est juste qu'il n'y a pas d'amis
        if (response.message && !response.message.includes("aucun")) {
          setError(response.message);
        }
      }
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
      const response = await apiService.getFriendRequests();
      if (response.success && response.data) {
        // Gestion flexible de la structure de données
        const requestsData = response.data.requests || response.data || [];
        setFriendRequests(Array.isArray(requestsData) ? requestsData : []);
        console.log(
          `✅ Friend requests loaded successfully: ${Array.isArray(requestsData) ? requestsData.length : 0} requests`
        );
      } else {
        console.log("⚠️ No friend requests data or unsuccessful response");
        setFriendRequests([]);
        // Ne pas considérer cela comme une erreur si c'est juste qu'il n'y a pas de demandes
        if (response.message && !response.message.includes("aucun")) {
          setError(response.message);
        }
      }
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
      const response = await apiService.sendFriendRequest(userId);
      if (response.success) {
        console.log("✅ Friend request sent successfully");
        await loadSentRequests(); // Recharger les demandes envoyées
        return true;
      } else {
        setError(
          response.message || "Erreur lors de l'envoi de la demande d'amitié"
        );
        return false;
      }
    } catch (err) {
      console.error("❌ Error sending friend request:", err);
      setError("Erreur lors de l'envoi de la demande d'amitié");
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      console.log(`✅ Accepting friend request ${requestId}...`);
      const response = await apiService.respondToFriendRequest(
        requestId,
        "accepted"
      );
      if (response.success) {
        console.log("✅ Friend request accepted successfully");
        // Espacer les appels pour éviter le rate limiting
        await loadFriends();
        await new Promise((resolve) => setTimeout(resolve, 200));
        await loadFriendRequests();
        return true;
      } else {
        setError(
          response.message ||
            "Erreur lors de l'acceptation de la demande d'amitié"
        );
        return false;
      }
    } catch (err) {
      console.error("❌ Error accepting friend request:", err);
      setError("Erreur lors de l'acceptation de la demande d'amitié");
      return false;
    }
  };

  const rejectFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      console.log(`❌ Rejecting friend request ${requestId}...`);
      const response = await apiService.respondToFriendRequest(
        requestId,
        "blocked"
      );
      if (response.success) {
        console.log("✅ Friend request rejected successfully");
        await loadFriendRequests();
        return true;
      } else {
        setError(
          response.message || "Erreur lors du rejet de la demande d'amitié"
        );
        return false;
      }
    } catch (err) {
      console.error("❌ Error rejecting friend request:", err);
      setError("Erreur lors du rejet de la demande d'amitié");
      return false;
    }
  };

  const removeFriend = async (friendId: string): Promise<boolean> => {
    try {
      console.log(`🗑️ Removing friend ${friendId}...`);
      const response = await apiService.removeFriend(friendId);
      if (response.success) {
        console.log("✅ Friend removed successfully");
        await loadFriends();
        return true;
      } else {
        setError(response.message || "Erreur lors de la suppression de l'ami");
        return false;
      }
    } catch (err) {
      console.error("❌ Error removing friend:", err);
      setError("Erreur lors de la suppression de l'ami");
      return false;
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    try {
      console.log(`🚫 Blocking user ${userId}...`);
      const response = await apiService.respondToFriendRequest(
        userId,
        "blocked"
      );
      if (response.success) {
        console.log("✅ User blocked successfully");
        await loadFriends();
        return true;
      } else {
        setError(response.message || "Erreur lors du blocage de l'utilisateur");
        return false;
      }
    } catch (err) {
      console.error("❌ Error blocking user:", err);
      setError("Erreur lors du blocage de l'utilisateur");
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
      console.log(
        "🔄 Starting sequential data refresh to avoid rate limiting..."
      );

      // Charger les amis en premier
      await loadFriends();

      // Attendre 300ms avant de charger les demandes d'amitié
      await new Promise((resolve) => setTimeout(resolve, 300));
      await loadFriendRequests();

      // Attendre encore 300ms avant de charger les demandes envoyées
      await new Promise((resolve) => setTimeout(resolve, 300));
      await loadSentRequests();

      console.log("✅ All friend data refreshed successfully");
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
