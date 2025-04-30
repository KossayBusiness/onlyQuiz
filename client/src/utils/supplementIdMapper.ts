/**
 * Système de mappage des identifiants de suppléments
 * Permet d'harmoniser les identifiants utilisés dans différentes parties de l'application
 */

// Table de correspondance entre les IDs du système de recommandation et ceux du système de synergies
const ID_MAPPING: Record<string, string> = {
  // Système de recommandation → Système de synergies
  "vitaminD": "vitamin_d3",
  "ashwagandha": "ashwagandha_ksm66",
  "probiotics": "probiotics_multi",
  "rhodiola": "rhodiola_rosea",
  "curcumin": "curcumin_complex",
  "bcomplex": "vitamin_b_complex",
  "lion_mane": "lions_mane",
  "ginger_extract": "ginger"
  // Les autres identifiants sont déjà harmonisés (magnesium, zinc, omega3, etc.)
};

/**
 * Normalise l'identifiant d'un supplément vers le format utilisé dans le système de synergies
 * @param supplementId Identifiant original du supplément
 * @returns Identifiant normalisé pour le système de synergies
 */
export function normalizeSupplementId(supplementId: string): string {
  // Si l'ID existe dans la table de correspondance, retourner l'ID mappé
  if (ID_MAPPING[supplementId]) {
    return ID_MAPPING[supplementId];
  }
  
  // Sinon, retourner l'ID original
  return supplementId;
}

/**
 * Convertit un tableau d'identifiants de suppléments vers le format normalisé
 * @param supplementIds Tableau d'identifiants de suppléments
 * @returns Tableau d'identifiants normalisés
 */
export function normalizeSupplementIds(supplementIds: string[]): string[] {
  return supplementIds.map(id => normalizeSupplementId(id));
}

/**
 * Obtient l'identifiant original à partir d'un identifiant normalisé
 * @param normalizedId Identifiant normalisé
 * @returns Identifiant original ou l'identifiant normalisé si aucune correspondance n'est trouvée
 */
export function getOriginalSupplementId(normalizedId: string): string {
  // Chercher dans la table de correspondance
  for (const [originalId, mappedId] of Object.entries(ID_MAPPING)) {
    if (mappedId === normalizedId) {
      return originalId;
    }
  }
  
  // Si aucune correspondance n'est trouvée, retourner l'ID normalisé
  return normalizedId;
}