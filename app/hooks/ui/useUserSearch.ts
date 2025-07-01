import { useCallback, useEffect, useRef, useState } from "react";
import { apiService } from "../../services/apiService";

interface SearchUser {
  id: string;
  alias: string;
  avatar?: string;
  description?: string;
  is_public: boolean;
}

interface UseUserSearchReturn {
  searchResults: SearchUser[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchUsers: (query: string) => Promise<void>;
  clearSearch: () => void;
  hasSearched: boolean;
}

export const useUserSearch = (): UseUserSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Refs pour gérer les timeouts et les requêtes en cours
  const searchTimeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fonction debounced pour éviter trop de requêtes
  const debouncedSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`🔍 Searching users with query: ${query}...`);
      const response = await apiService.searchUsers(query.trim());

      if (response.success && response.data) {
        // Gestion flexible de la structure de données
        const usersData = response.data.users || response.data || [];
        setSearchResults(Array.isArray(usersData) ? usersData : []);
        console.log(
          `✅ Found ${Array.isArray(usersData) ? usersData.length : 0} users`
        );
      } else {
        console.log("⚠️ No search results or unsuccessful response");
        setSearchResults([]);
        // Ne pas considérer cela comme une erreur si c'est juste qu'il n'y a pas de résultats
        if (
          response.message &&
          !response.message.includes("aucun") &&
          !response.message.includes("Trop de requêtes")
        ) {
          setError(response.message);
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const errorMessage = "Erreur lors de la recherche d'utilisateurs";
        setError(errorMessage);
        setSearchResults([]);
        console.error("❌ Error searching users:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(
    async (query: string) => {
      // Annuler le timeout précédent
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Si la query est vide, clear immédiatement
      if (!query.trim()) {
        clearSearch();
        return;
      }

      // Programmer la nouvelle recherche avec un délai
      searchTimeoutRef.current = setTimeout(() => {
        debouncedSearch(query);
      }, 300); // 300ms de débounce pour éviter le rate limiting
    },
    [debouncedSearch]
  );

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
    setSearchQuery("");
    setHasSearched(false);
    setLoading(false);
  };

  // Nettoyage des timeouts au démontage
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchUsers,
    clearSearch,
    hasSearched,
  };
};
