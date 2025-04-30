// Utilisez cet outil pour supprimer le case 4 dans le switch de renderStep

const fs = require('fs');
const path = 'client/src/pages/quiz.tsx';
const content = fs.readFileSync(path, 'utf8');

// Trouve le case 4 problématique
const pattern = /      case 4: \/\/ Ce cas est désormais fusionné avec l'étape Priorités \(étape 3\)([\s\S]*?)case 5:/g;
const replacement = '      // Ce cas a été supprimé car il fait doublon\n\n      case 5:';

// Remplace le texte
const newContent = content.replace(pattern, replacement);

// Sauvegarde le fichier
fs.writeFileSync(path, newContent, 'utf8');

console.log('Modification effectuée avec succès');
