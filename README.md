# 📱 PickMe Frontend - Design System Minimaliste

Une application mobile React Native de réseau social de rencontres avec un design system **strictement minimaliste** et **parfaitement fonctionnel**.

## 🎯 Philosophie

**Minimalisme avant tout :** Ce design system privilégie la **fonctionnalité** et la **simplicité** au design. Chaque composant est réduit à son essence pour assurer un fonctionnement parfait.

## 🧩 Composants Disponibles

### SafeArea Wrappers

```tsx
import {
  ScreenWrapper,
  SafeTopWrapper,
  SafeBottomWrapper,
} from "./app/components";

// Wrapper d'écran complet
<ScreenWrapper>
  <Content />
</ScreenWrapper>;
```

### Boutons

```tsx
import { Button } from "./app/components";

<Button title="Primaire" variant="primary" />
<Button title="Secondaire" variant="secondary" />
<Button title="Contour" variant="outline" />
<Button title="Désactivé" disabled />
```

### Inputs

```tsx
import { Input } from "./app/components";

<Input
  label="Email"
  placeholder="votre@email.com"
  leftIcon={<Text>📧</Text>}
  error="Message d'erreur"
/>;
```

### Cartes & Listes

```tsx
import { Card, TouchableCard, ListItem, Section } from "./app/components";

<Section title="Ma section">
  <Card>
    <Text>Contenu de base</Text>
  </Card>

  <Card className="p-0">
    <ListItem title="Titre" subtitle="Sous-titre" showChevron />
  </Card>
</Section>;
```

## 🎨 Constantes de Design

```tsx
import { SPACING, SIZES, COLORS } from "./app/constants/design";

// Espacements : xs=4px, sm=8px, md=16px, lg=24px
// Tailles : button=44px, input=44px
// Couleurs : primary, secondary, danger, success
```

## 🚀 Utilisation

1. **TOUJOURS** utiliser `ScreenWrapper` pour les écrans
2. **JAMAIS** utiliser SafeAreaView directement
3. Préférer les classes Tailwind : `px-md`, `mb-sm`, `bg-primary`
4. Garder le design **simple** et **fonctionnel**

## 🔧 Configuration

- **Tailwind** : Configuration minimaliste dans `tailwind.config.js`
- **Types** : Tous les composants sont typés TypeScript
- **Responsive** : Adaptatif iOS/Android automatiquement

---

**📍 Priorité** : Fonctionnalité > Esthétique. Le design viendra plus tard ! 🎯
