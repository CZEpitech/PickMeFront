# Documentation Technique - PickMeFront

Guide détaillé pour comprendre et modifier l'app.

## Architecture des Services

### Comment ça marche

Chaque service dans `/app/services/` suit le même pattern :

```typescript
const API_BASE_URL = 'http://82.165.172.113:8745/api/v1';

export const monService = {
  async maFonction(token: string, params): Promise<ApiResponse<Type>> {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint`, {
        method: 'GET|POST|PUT|DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // si POST/PUT
        },
        body: JSON.stringify(data), // si POST/PUT
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Erreur réseau' };
    }
  }
};
```

### Format de réponse standardisé

Tous les services retournent le même format :
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

## Appels API détaillés

### 1. Authentification

**Inscription d'un utilisateur :**
```typescript
// Dans un composant
import { authService } from '../services/authService';

const handleRegister = async () => {
  const result = await authService.register({
    email: 'user@example.com',
    password: 'motdepasse123',
    alias: 'monpseudo'
  });

  if (result.success) {
    // Token dans result.data.token
    await tokenStorage.saveToken(result.data.token);
  } else {
    // Erreur dans result.message
    Alert.alert('Erreur', result.message);
  }
};
```

**Ce qui se passe côté réseau :**
```
POST http://82.165.172.113:8745/api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123", 
  "alias": "monpseudo"
}

Réponse si OK (200):
{
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": { "id": "uuid", "email": "..." },
    "profile": { "alias": "monpseudo", ... }
  }
}

Réponse si erreur (400/500):
{
  "message": "Email déjà utilisé"
}
```

### 2. Gestion du profil

**Récupérer son profil :**
```typescript
import { profileService } from '../services/profileService';
import { tokenStorage } from '../services/tokenStorage';

const loadProfile = async () => {
  const token = await tokenStorage.getToken();
  const result = await profileService.getMyProfile(token);

  if (result.success) {
    setProfile(result.data.profile);
  }
};
```

**Détail de l'appel :**
```
GET http://82.165.172.113:8745/api/v1/profile/me
Authorization: Bearer eyJhbGciOiJIUzI1...

Réponse:
{
  "data": {
    "user": { "id": "uuid", "email": "..." },
    "profile": {
      "id": "uuid",
      "alias": "monpseudo",
      "description": "Ma bio",
      "avatar": "url_image",
      "is_public": true,
      "birthdate": "1995-01-01",
      "pays": "France"
    }
  }
}
```

**Modifier son profil :**
```typescript
const updateProfile = async () => {
  const token = await tokenStorage.getToken();
  
  const result = await profileService.updateMyProfile(token, {
    alias: 'nouveau_pseudo',
    description: 'Nouvelle bio',
    is_public: false
  });

  if (result.success) {
    setProfile(result.data);
  }
};
```

**Détail de l'appel :**
```
PUT http://82.165.172.113:8745/api/v1/profile/me
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "alias": "nouveau_pseudo",
  "description": "Nouvelle bio", 
  "is_public": false
}
```

### 3. Système d'amis

**Chercher des amis :**
```typescript
import { usersService } from '../services/usersService';

const searchUsers = async (query: string) => {
  const token = await tokenStorage.getToken();
  
  const result = await usersService.searchUsers(token, query, 1, 20);
  
  if (result.success) {
    setSearchResults(result.data);
  }
};
```

**Détail de l'appel :**
```
GET http://82.165.172.113:8745/api/v1/users/search?q=john&page=1&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1...

Réponse:
{
  "data": [
    {
      "id": "uuid",
      "alias": "john_doe",
      "avatar": "url",
      "is_public": true,
      "description": "Salut!"
    }
  ]
}
```

**Envoyer une demande d'amitié :**
```typescript
import { friendsService } from '../services/friendsService';

const addFriend = async (userId: string) => {
  const token = await tokenStorage.getToken();
  
  const result = await friendsService.addFriend(token, userId);
  
  if (result.success) {
    Alert.alert('Succès', 'Demande envoyée !');
  }
};
```

**Détail de l'appel :**
```
POST http://82.165.172.113:8745/api/v1/friends
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "friend_id": "uuid-de-l-utilisateur"
}
```

**Répondre à une demande d'amitié :**
```typescript
const respondToRequest = async (friendId: string, accept: boolean) => {
  const token = await tokenStorage.getToken();
  
  const result = await friendsService.respondToFriendRequest(
    token, 
    friendId, 
    accept ? 'accepted' : 'declined'
  );
  
  if (result.success) {
    // Recharger la liste
    loadFriendRequests();
  }
};
```

**Détail de l'appel :**
```
PUT http://82.165.172.113:8745/api/v1/friends/uuid-friend/respond
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "status": "accepted"  // ou "declined"
}
```

### 4. Gestion des images

**Upload d'une image :**
```typescript
import { imagesService } from '../services/imagesService';

const uploadImage = async (imageUri: string) => {
  const token = await tokenStorage.getToken();
  
  const result = await imagesService.addImage(token, {
    image_link: imageUri,
    is_pinned: false
  });
  
  if (result.success) {
    // Image ajoutée
    loadMyImages();
  }
};
```

**Détail de l'appel :**
```
POST http://82.165.172.113:8745/api/v1/images
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "image_link": "file://path/to/image.jpg",
  "is_pinned": false
}
```

## Gestion du token JWT

### Stockage sécurisé

```typescript
import { tokenStorage } from '../services/tokenStorage';

// Sauvegarder après login
await tokenStorage.saveToken(token);

// Récupérer pour les appels API
const token = await tokenStorage.getToken();

// Supprimer au logout
await tokenStorage.removeToken();
```

### Vérification automatique

Dans `app/index.tsx`, l'app vérifie automatiquement si l'utilisateur est connecté :

```typescript
useEffect(() => {
  checkAuthStatus();
}, []);

const checkAuthStatus = async () => {
  const token = await tokenStorage.getToken();
  
  if (token) {
    const result = await authService.verifyToken(token);
    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      await tokenStorage.removeToken();
      router.replace('/auth');
    }
  } else {
    router.replace('/auth');
  }
};
```

## Navigation avec Expo Router

### Structure des routes

```
app/
├── index.tsx          → / (check auth)
├── auth.tsx           → /auth (login)
├── register.tsx       → /register 
└── (tabs)/
    ├── _layout.tsx    → Navigation tabs
    ├── home.tsx       → /(tabs)/home
    ├── profile.tsx    → /(tabs)/profile
    └── ...
```

### Navigation entre pages

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Aller vers une page
router.push('/register');

// Remplacer la page actuelle (pas de retour possible)
router.replace('/(tabs)/home');

// Retour page précédente
router.back();
```

## Gestion d'état dans les composants

### Pattern typique

```typescript
import React, { useEffect, useState } from 'react';

export default function MaPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = await tokenStorage.getToken();
      const result = await monService.getData(token);
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Chargement...</Text>;
  if (error) return <Text>Erreur: {error}</Text>;

  return (
    <View>
      {/* Afficher data */}
    </View>
  );
}
```

## Styles avec NativeWind

### Classes Tailwind adaptées

```typescript
// Containers
<View className="flex-1 bg-primary-bg px-4 py-2">

// Textes  
<Text className="text-primary-text text-lg font-bold">

// Boutons
<TouchableOpacity className="bg-surface-elevated rounded-lg px-4 py-2">

// Inputs
<TextInput className="bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2" />
```

### Variables CSS définies

Dans `global.css` :
```css
:root {
  --primary-bg: #8894B9;
  --primary-text: #F5C74D;
  --surface-elevated: rgba(245, 199, 77, 0.1);
  --border-subtle: rgba(245, 199, 77, 0.2);
  ...
}
```

## Debugging

### Logs utiles

```typescript
// Dans les services
console.log('📡 API Call:', endpoint, params);
console.log('✅ Success:', result.data);
console.log('❌ Error:', result.message);

// Dans les composants
console.log('🔄 Loading state:', loading);
console.log('👤 User data:', user);
```

### Erreurs courantes

**Token expiré :**
```
❌ Error: 401 Unauthorized
→ Solution: Relancer l'app ou se reconnecter
```

**Réseau inaccessible :**
```  
❌ Error: Network request failed
→ Solution: Vérifier que l'API tourne sur 82.165.172.113:8745
```

**Données manquantes :**
```
❌ Error: Cannot read property 'data' of undefined
→ Solution: Vérifier if (result.success) avant d'accéder à result.data
```

## Ajouter un nouveau endpoint

### 1. Ajouter dans le service

```typescript
// app/services/monService.ts
export const monService = {
  async nouvelleAction(token: string, params): Promise<ApiResponse<Type>> {
    try {
      const response = await fetch(`${API_BASE_URL}/nouveau-endpoint`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Erreur réseau' };
    }
  }
};
```

### 2. Définir les types

```typescript
// Au début du fichier service
export interface NouveauType {
  id: string;
  name: string;
  // ...
}
```

### 3. Utiliser dans un composant

```typescript
import { monService } from '../services/monService';

const handleAction = async () => {
  const token = await tokenStorage.getToken();
  const result = await monService.nouvelleAction(token, params);
  
  if (result.success) {
    // Traiter result.data
  } else {
    Alert.alert('Erreur', result.message);
  }
};
```

## Variables d'environnement

Pour changer l'URL de l'API, modifier dans chaque service :

```typescript
const API_BASE_URL = 'http://NOUVELLE-IP:PORT/api/v1';
```

Ou créer un fichier `app/config.ts` :
```typescript
export const Config = {
  API_BASE_URL: 'http://82.165.172.113:8745/api/v1',
};
```

## Tests avec Postman

Le fichier `postman.json` contient tous les endpoints testables. 

Pour l'utiliser :
1. Importer dans Postman
2. Faire Login pour récupérer le token
3. Le token s'enregistre automatiquement dans `{{authToken}}`
4. Tester les autres endpoints

## Problèmes connus et solutions

### iOS vs Android

Les pickers de sélection (pays, langues) utilisent `ActionSheetIOS` qui ne marche que sur iOS. Pour Android, il faut implémenter un modal custom.

### Permissions photos

Sur iOS, les permissions sont demandées automatiquement. Sur Android, il faut parfois relancer l'app.

### Pagination

Certaines listes n'ont pas de pagination automatique, il faut implémenter le scroll infini manuellement.

### Images

Actuellement les images sont juste stockées avec leur URI local. En prod il faudrait les upload sur un CDN.

C'est tout pour l'instant. Cette doc devrait couvrir 90% des cas d'usage.