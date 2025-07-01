import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("./auth");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue sur PickMe!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.cardTitle}>Mon Profil</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>ID Utilisateur:</Text>
          <Text style={styles.value}>{user.id}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Alias:</Text>
          <Text style={styles.value}>{user.alias}</Text>
        </View>

        {user.birthdate && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date de naissance:</Text>
            <Text style={styles.value}>
              {new Date(user.birthdate).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        )}

        {user.pays && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pays:</Text>
            <Text style={styles.value}>{user.pays}</Text>
          </View>
        )}

        {user.langue && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Langue:</Text>
            <Text style={styles.value}>{user.langue}</Text>
          </View>
        )}

        {user.description && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{user.description}</Text>
          </View>
        )}

        {user.pronous && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pronoms:</Text>
            <Text style={styles.value}>{user.pronous}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Profil public:</Text>
          <Text style={styles.value}>{user.is_public ? "Oui" : "Non"}</Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Actions rapides</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Modifier le profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Voir mes images</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Mes amis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsCard: {
    backgroundColor: "#ffffff",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 2,
    textAlign: "right",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
