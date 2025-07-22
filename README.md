# PickMeFront

App mobile de réseau social en React Native pour le projet T-YEP.

## C'est quoi ?

Une app de rencontres/réseau social basique avec :
- Inscription/connexion
- Profil utilisateur avec photos
- Système d'amis
- Recherche d'utilisateurs

## Stack technique

- **React Native** avec Expo
- **TypeScript** 
- **NativeWind** pour le style
- **Expo Router** pour la navigation
- **AsyncStorage** pour les tokens

## Structure du projet

```
app/
├── (tabs)/           # Pages principales (home, profil, etc.)
├── components/       # Composants réutilisables  
├── services/         # API calls et logique métier
├── auth.tsx         # Page de connexion
├── register.tsx     # Page d'inscription
└── index.tsx        # Point d'entrée
```

## API Backend

L'app se connecte à une API REST hébergée sur `http://82.165.172.113:8745/api/v1`

### Endpoints utilisés :
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion  
- `GET /auth/verify` - Vérif token
- `GET /profile/me` - Mon profil
- `PUT /profile/me` - Update profil
- `GET /friends` - Liste amis
- `POST /friends` - Ajouter ami
- `PUT /friends/:id/respond` - Accepter/refuser
- `GET /users/search` - Chercher users
- `POST /images` - Upload photo
- `GET /images/me` - Mes photos

## Installation

```bash
npm install
npm start
```

Pour tester :
```bash
npm run ios     # iOS simulator
npm run android # Android emulator
```

## Fonctionnalités implémentées

### ✅ Auth
- [x] Inscription avec email/password/pseudo
- [x] Connexion 
- [x] Déconnexion
- [x] Persistance du token

### ✅ Profil
- [x] Voir mon profil
- [x] Modifier infos (nom, description, date naissance...)
- [x] Upload/modifier photo de profil
- [x] Visibilité public/privé

### ✅ Amis
- [x] Chercher des utilisateurs
- [x] Envoyer demandes d'amitié
- [x] Accepter/refuser demandes
- [x] Voir liste d'amis

### ✅ Photos
- [x] Upload photos depuis galerie/appareil photo
- [x] Voir mes photos
- [x] Épingler des photos importantes

## Problèmes connus

- Les pickers de pays/langue marchent que sur iOS pour l'instant
- Pas de pagination sur certaines listes
- Design très basique (c'était le but)

## Notes de dev

Le code est assez simple, j'ai essayé de pas trop complexifier. Chaque service gère sa partie de l'API et les composants sont basiques mais fonctionnels.

Les styles utilisent NativeWind mais c'est pas très poussé niveau design - c'était plus pour avoir quelque chose de propre rapidement.

## Structure des services

Chaque service (auth, profile, friends, etc.) suit le même pattern :
```typescript
export const monService = {
  async maFonction(params): Promise<ApiResponse> {
    // fetch API
    // return { success: true/false, data?, message? }
  }
}
```

## Config

Pour changer l'URL de l'API, modifier `API_BASE_URL` dans les fichiers services.

## Dépendances principales

- `expo` ~53.0.15
- `react-native` 0.79.4
- `@expo/vector-icons` pour les icônes
- `expo-image-picker` pour les photos
- `@react-native-async-storage/async-storage` pour le stockage
- `@react-native-community/datetimepicker` pour les dates

## Commandes utiles

```bash
npm run lint        # Vérifier le code
npx expo doctor     # Diagnostics
npx expo install    # Installer dépendances Expo
```