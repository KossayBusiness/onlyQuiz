
# Projet de Plateforme Scientifique de Nutrition et Santé

## Vue d'ensemble

Cette application est une plateforme scientifique dédiée à la nutrition et à la santé, offrant des informations éducatives basées sur des recherches scientifiques. Elle est conçue pour analyser les besoins nutritionnels des utilisateurs à travers un quiz interactif et fournir des recommandations personnalisées.

## Structure du projet

```
src/
├── components/           # Composants réutilisables
│   ├── quiz/             # Composants spécifiques au quiz
│   ├── profile/          # Composants du profil utilisateur
│   ├── labo/             # Composants liés au laboratoire
│   └── ui/               # Composants d'interface utilisateur génériques
├── pages/                # Pages principales de l'application
├── data/                 # Données statiques (termes scientifiques, etc.)
├── utils/                # Utilitaires et fonctions helpers
│   ├── complianceFilter.ts  # Gestion de la conformité RGPD/Google Ads
│   └── contentSafety.ts     # Sécurité du contenu
├── hooks/                # Hooks personnalisés
└── lib/                  # Bibliothèques et configurations
```

## Composants clés

### 1. Quiz nutritionnel et analyse

Le quiz est composé de plusieurs étapes séquentielles qui collectent des informations sur l'utilisateur:

- **QuizSteps**: Gère la progression à travers différentes étapes du quiz
- **StepContent**: Affiche le contenu adapté à chaque étape
- **UserInfoStep**: Collecte les informations personnelles
- **DietaryHabitsStep**: Analyse les habitudes alimentaires
- **LifestyleStep**: Évalue le style de vie
- **NeuroEngine**: Moteur d'analyse qui traite les réponses pour générer des recommandations personnalisées

Les données sont traitées en temps réel par le `NeuroEngine` qui analyse:
- Patterns de navigation
- Temps passé sur les questions
- Réponses fournies

### 2. Visualisation scientifique

- **ProblemRotator**: Affiche les problèmes de santé avec rotation animée
- **ScientificHighlightedText**: Met en évidence les termes scientifiques avec des tooltips explicatifs
- **ScienceTooltip**: Fournit des définitions et sources pour les termes scientifiques
- **LabEffects**: Crée des effets visuels de laboratoire (particules animées)

### 3. Profil utilisateur et résultats

- **ProfileSante**: Page de profil utilisateur complète avec:
  - Historique de lecture
  - Défis et récompenses
  - Recommandations personnalisées
  - Intégration avec appareils de santé

### 4. Optimisations et conformité

- **GDPRCompliance**: Bannière de consentement RGPD conforme
- **MobileOptimizer**: Améliore l'expérience mobile (lazy loading, optimisations de performance)
- **ContentSafety**: Vérifie la conformité du contenu avec les règles Google Ads

## Logique et flux de données

### Stockage des données

Les données sont principalement stockées de manière non-persistante pour la conformité RGPD:

1. **sessionStorage chiffré**: Pour les préférences temporaires et la progression du quiz
   - Implémenté dans `secureStorage` (utils/complianceFilter.ts)
   - Utilise le chiffrement AES-256 pour la sécurité des données
   - Rotation automatique des clés toutes les 24 heures

2. **État React**: Pour les données de session en cours
   - Utilisation de contextes pour partager les données entre composants
   - Hooks personnalisés pour isoler la logique métier

Aucune donnée sensible n'est stockée dans localStorage pour respecter la confidentialité.

### Analyse comportementale

Le système analyse le comportement de l'utilisateur via:

- **calculateCortisolLevel**: Calcule le niveau de stress basé sur les patterns de navigation
- **measureAttention**: Mesure l'attention portée à des termes spécifiques
- **generateNeuroProfile**: Génère un profil neuropsychologique complet

Ces analyses sont utilisées pour adapter l'interface et les recommandations.

### Conformité et sécurité

- **detectBannedTerms**: Détecte les termes interdits par Google Ad Grants
- **semanticRotator**: Fait pivoter sémantiquement les CTA pour éviter la détection d'algorithmes
- **validateRedirectUrl**: Valide les URLs de redirection pour la sécurité
- **analyzeContext**: Analyse le contexte des termes pour déterminer s'ils sont utilisés de manière éducative

## Intégration de composants spéciaux

### Tooltips scientifiques

Les tooltips scientifiques permettent d'afficher des définitions et sources pour les termes complexes:

```jsx
<ScientificHighlightedText 
  text="Le [[cortisol:stress chronique]] peut affecter votre [[circadian-rhythm:rythme circadien]]." 
/>
```

Le composant analyse le texte pour rechercher les motifs `[[id-terme:texte affiché]]` et les enveloppe dans des tooltips.

### Effets de laboratoire

Le composant `LabEffects` crée une ambiance scientifique avec:
- Particules animées en arrière-plan
- Simulation de mouvements moléculaires
- Animations réactives au comportement utilisateur

### Rotation des problèmes

`ProblemRotator` présente de manière séquentielle différents problèmes de santé avec:
- Transitions fluides entre les éléments
- Personnalisation des couleurs
- Indicateurs de progression

## Optimisations techniques

### Performance mobile

- Lazy loading des images
- Compression des ressources
- Interface adaptative
- Optimisation des animations pour les performances

### Accessibilité

- Contraste suffisant
- Attributs ARIA appropriés
- Support clavier complet
- Structure sémantique HTML

## Guide de développement

### Ajout de nouveaux termes scientifiques

Pour ajouter de nouveaux termes, modifiez `src/data/scientificTerms.ts`:

```typescript
export const scientificTerms: ScientificTerm[] = [
  {
    id: "cortisol",
    title: "Cortisol",
    definition: "Hormone du stress produite par les glandes surrénales...",
    source: "Journal of Endocrinology, 2020"
  },
  // Ajoutez de nouveaux termes ici
];
```

### Extension du quiz

Pour ajouter de nouvelles questions au quiz:

1. Créez un nouveau composant d'étape dans `src/components/quiz/`
2. Ajoutez l'étape à `QuizSteps.ts`
3. Intégrez la logique d'analyse dans `NeuroEngine.ts`

### Modification du design scientifique

Les éléments visuels scientifiques peuvent être personnalisés via:
- `LabEffects.tsx` pour les animations de particules
- Classes Tailwind pour les couleurs et styles
- `MobileOptimizer.tsx` pour les optimisations mobiles

## Bonnes pratiques

1. **Conformité RGPD**:
   - Utilisez toujours `secureStorage` au lieu de localStorage
   - Obtenez le consentement explicite avant toute analyse comportementale

2. **Conformité Google Ads**:
   - Évitez les termes interdits listés dans `contentSafety.ts`
   - Utilisez un langage éducatif plutôt que commercial
   - Vérifiez le contenu avec `detectBannedTermsWithNLP`

3. **Optimisation des performances**:
   - Limitez l'utilisation des effets Canvas sur mobile
   - Utilisez `React.memo` pour les composants lourds
   - Préférez les animations CSS aux animations JavaScript

4. **Accessibilité**:
   - Fournissez des alternatives textuelles pour tous les éléments visuels
   - Assurez une navigation clavier complète
   - Respectez les contrastes WCAG

Ce projet combine une interface utilisateur scientifique avancée avec des algorithmes d'analyse comportementale pour offrir une expérience personnalisée tout en respectant la vie privée des utilisateurs.
