import { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";

interface UserImage {
  id: string;
  image_link: string;
  is_pinned: boolean;
  created_at: string;
}

interface UseUserImagesReturn {
  images: UserImage[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  loadImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  getRecentPhotosCount: () => number;
}

export const useUserImages = (
  page: number = 1,
  limit: number = 50,
  pinnedOnly: boolean = false
): UseUserImagesReturn => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("📸 Loading user images...");
      const response = await apiService.getUserImages(page, limit, pinnedOnly);
      if (response.success && response.data) {
        setImages(response.data.images || []);
        console.log("✅ Images loaded successfully");
      } else {
        setError(response.message || "Erreur lors du chargement des images");
        console.log("❌ Failed to load images:", response.message);
      }
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des images";
      setError(errorMessage);
      console.error("❌ Error loading images:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = async () => {
    setRefreshing(true);
    setError(null);
    try {
      console.log("🔄 Refreshing user images...");
      const response = await apiService.getUserImages(page, limit, pinnedOnly);
      if (response.success && response.data) {
        setImages(response.data.images || []);
        console.log("✅ Images refreshed successfully");
      } else {
        setError(response.message || "Erreur lors du rafraîchissement");
        console.log("❌ Failed to refresh images:", response.message);
      }
    } catch (err) {
      const errorMessage = "Erreur lors du rafraîchissement";
      setError(errorMessage);
      console.error("❌ Error refreshing images:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const getRecentPhotosCount = (): number => {
    const recent = images.filter((img) => {
      const photoDate = new Date(img.created_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return photoDate > dayAgo;
    });
    return recent.length;
  };

  // Auto-load images on mount
  useEffect(() => {
    loadImages();
  }, [page, limit, pinnedOnly]);

  return {
    images,
    loading,
    refreshing,
    error,
    loadImages,
    refreshImages,
    getRecentPhotosCount,
  };
};
