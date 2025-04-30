
# Documentation Complète du Projet

## Vue d'ensemble

Ce projet est une application web dédiée à l'éducation scientifique et à la personnalisation des recommandations nutritionnelles basées sur des données scientifiques validées. L'application combine des articles de haute qualité, un quiz interactif et des visualisations scientifiques pour aider les utilisateurs à comprendre leurs besoins nutritionnels.

## Architecture Technique

### Frontend
- **Framework**: React avec TypeScript
- **Router**: React Router v6
- **UI/UX**: 
  - TailwindCSS pour les styles
  - shadcn/ui pour les composants UI
  - Animations avec des transitions CSS et framer-motion
- **State Management**: 
  - React Query pour les requêtes de données
  - Context API pour l'état global
  - localStorage/sessionStorage pour la persistance côté client

### Composants Principaux

#### Composants de Navigation
- `Navbar.tsx`: Barre de navigation principale
- `Footer.tsx`: Pied de page avec liens importants

#### Composants de Page
- `Index.tsx`: Page d'accueil avec mise en avant des fonctionnalités
- `Quiz.tsx`: Interface du quiz nutritionnel
- `Article.tsx`: Page d'article détaillé
- `Articles.tsx`: Liste des articles disponibles
- `ProfileSante.tsx`: Profil utilisateur avec recommandations personnalisées
- `LaboSolutions.tsx`: Présentation du laboratoire et de ses recherches

#### Composants Quiz
- `StepContent.tsx`: Gère le contenu de chaque étape du quiz
- `UserInfoStep.tsx`, `DietaryHabitsStep.tsx`, etc.: Étapes spécifiques du quiz
- `QuizProgress.tsx`: Barre de progression du quiz
- `NeuroEngine.ts`: Logique d'analyse des réponses et de génération des recommandations

#### Composants Scientifiques
- `LabEffects.tsx`: Effets visuels scientifiques
- `ProblemRotator.tsx`: Rotation des problèmes de santé avec animations
- `ScientificTrustBadges.tsx`: Badges de confiance scientifique
- `ScienceTooltip.tsx`: Tooltips pour expliquer les termes scientifiques

#### Composants Utilitaires
- `InstagramCarousel.tsx`: Carrousel pour les publications Instagram
- `InstagramCTA.tsx`: Appel à l'action pour suivre sur Instagram
- `FeaturedArticle.tsx`: Mise en avant d'articles spécifiques

### Flux de Données

#### Stockage Local
Les données utilisateur sont actuellement stockées dans le localStorage:
- `quiz_responses`: Réponses du quiz
- `user_profile`: Données du profil utilisateur
- `reading_history`: Historique des articles lus

#### Modèle de Données
1. **Utilisateur**
   ```typescript
   interface User {
     id: string;
     quizResponses?: Record<string, any>;
     recommendations?: Recommendation[];
     healthScore?: number;
     readingHistory?: string[];
   }
   ```

2. **Article**
   ```typescript
   interface Article {
     id: string;
     title: string;
     excerpt: string;
     content: string;
     author: string;
     date: string;
     category: string;
     tags: string[];
     image: string;
     readTime: string;
   }
   ```

3. **Quiz**
   ```typescript
   interface QuizStep {
     id: string;
     title: string;
     questions: Question[];
   }
   
   interface Question {
     id: string;
     text: string;
     type: 'single' | 'multiple' | 'slider' | 'text';
     options?: Option[];
   }
   ```

### Logique Métier Clé

#### Processus du Quiz
1. L'utilisateur parcourt plusieurs étapes (informations personnelles, habitudes alimentaires, symptômes, etc.)
2. Chaque réponse est stockée dans un état global et localement
3. Le `NeuroEngine` analyse les réponses pour générer un profil
4. Les recommandations sont calculées en fonction de ce profil
5. Les résultats sont présentés avec une visualisation scientifique

#### Système de Recommandation
- Actuellement basé sur des règles prédéfinies dans `NeuroEngine.ts`
- Catégorise les utilisateurs en différents profils (ex: "Déficit énergétique", "Stress chronique")
- Associe chaque profil à des recommandations spécifiques
- Les recommandations incluent des articles, des suppléments et des habitudes

#### Personnalisation du Contenu
- Les articles affichés sont filtrés en fonction du profil utilisateur
- L'ordre de présentation est déterminé par la pertinence pour l'utilisateur
- Des CTAs contextuels sont insérés dans les articles en fonction des besoins identifiés

### Optimisations Techniques

#### Performance
- Chargement différé des composants non critiques
- Optimisation des images avec formats modernes (WebP)
- Minimisation des re-rendus avec React.memo et useMemo

#### Accessibilité
- Utilisation des attributs ARIA pour les composants interactifs
- Contraste des couleurs respectant les normes WCAG
- Support de la navigation au clavier

#### UX Mobile
- Design responsive avec approche mobile-first
- Tailles de tap target optimisées pour les appareils tactiles
- Optimisations de performance spécifiques aux appareils mobiles

## Guides de Développement

### Ajouter un Nouvel Article
1. Créer un nouvel objet article dans la fonction `fetchArticle`
2. Ajouter les métadonnées (titre, auteur, date, etc.)
3. Rédiger le contenu en HTML avec les classes appropriées
4. Ajouter l'article à la liste `relatedArticles` si nécessaire

### Modifier le Quiz
1. Mettre à jour les étapes dans `QuizSteps.ts`
2. Ajouter/modifier les questions dans les composants d'étape correspondants
3. Adapter la logique d'analyse dans `NeuroEngine.ts` si nécessaire

### Ajouter des Termes Scientifiques
1. Ajouter de nouveaux termes dans `scientificTerms.ts`
2. Utiliser la syntaxe `[[term-id:texte à afficher]]` dans le contenu où le terme doit apparaître
3. Le composant `ScientificHighlightedText` détectera automatiquement ces termes et ajoutera les tooltips

### Créer une Nouvelle Page
1. Créer un nouveau fichier dans `src/pages/`
2. Utiliser les composants existants pour maintenir la cohérence visuelle
3. Ajouter la route dans `App.tsx`
4. Mettre à jour la navigation dans `Navbar.tsx`

## Technologies Externes et Intégrations

### Bibliothèques Principales
- `lucide-react`: Icônes cohérentes
- `recharts`: Visualisations de données
- `@tanstack/react-query`: Gestion des requêtes de données
- `sonner`: Notifications toast élégantes

### Hooks Personnalisés
- `useQuizNavigation`: Gestion de la navigation entre les étapes du quiz
- `useMobile`: Détection des appareils mobiles pour l'optimisation UI
- `useToast`: Interface simplifiée pour les notifications toast

## Roadmap et Développements Futurs

### Priorités Immédiates
1. Tooltips scientifiques sur les termes complexes (✅ Implémenté)
2. FAQ interactive générée par IA
3. Système de badges scientifiques

### Améliorations à Moyen Terme
1. Assistant virtuel de laboratoire
2. Mode sombre avec thème laboratoire
3. Personnalisation neuroscientifique de l'UI

### Vision Long Terme
1. Backend avec authentification et stockage sécurisé
2. Système de recommandation basé sur le machine learning
3. Intégration avec des appareils connectés pour le suivi nutritionnel

## Conventions et Standards

### Nommage
- Composants: PascalCase
- Hooks: camelCase avec préfixe "use"
- Utilitaires: camelCase
- Types: PascalCase avec suffixe descriptif (ex: UserProfile, ArticleData)

### Structure des Dossiers
- `/components`: Tous les composants React
- `/components/ui`: Composants UI réutilisables
- `/components/quiz`: Composants spécifiques au quiz
- `/pages`: Composants de page de haut niveau
- `/hooks`: Hooks personnalisés
- `/lib`: Utilitaires et fonctions helpers
- `/data`: Données statiques et mocks

### Style de Code
- TypeScript strict
- Composants fonctionnels avec Hooks
- Préférence pour les composants contrôlés
- ESLint et Prettier pour le formatage

## Contribuer au Projet

Pour contribuer au projet:
1. Forker le repository
2. Créer une branche pour votre fonctionnalité
3. Implémenter les changements en suivant les conventions
4. Soumettre une pull request avec une description détaillée

---

Cette documentation est en évolution constante. Pour toute question ou suggestion, n'hésitez pas à contacter l'équipe de développement.
