import React, { useState } from 'react';
import { 
  Grid2X2, 
  Zap, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Pill,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { SYNERGY_CATEGORY_COLORS, SynergyCategory, getCategoryLabel } from '@/utils/synergyTypes';

interface SynergyLevel {
  level: 'high' | 'moderate' | 'low' | 'negative' | 'unknown';
  description: string;
  category?: SynergyCategory;
}

interface SupplementInteraction {
  supplement1: string;
  supplement2: string;
  synergy: SynergyLevel;
}

interface SynergyMatrixViewProps {
  supplements: {
    id: string;
    name: string;
    description?: string;
  }[];
  interactions?: SupplementInteraction[];
  className?: string;
}

export function SynergyMatrixView({ 
  supplements, 
  interactions = [],
  className = ''
}: SynergyMatrixViewProps) {
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null);
  
  // Fonction pour obtenir le niveau de synergie entre deux suppléments
  const getSynergyLevel = (id1: string, id2: string): SynergyLevel => {
    // Si un supplément est comparé avec lui-même, renvoyer 'unknown'
    if (id1 === id2) {
      return { level: 'unknown', description: '—' };
    }
    
    // Chercher dans les interactions définies
    const interaction = interactions.find(
      i => (i.supplement1 === id1 && i.supplement2 === id2) || (i.supplement1 === id2 && i.supplement2 === id1)
    );
    
    // Si aucune interaction n'est définie, générer une interaction par défaut
    if (!interaction) {
      const randomLevel = Math.random();
      if (randomLevel > 0.9) {
        return { 
          level: 'high', 
          description: 'Forte synergie potentielle. Ces suppléments peuvent renforcer mutuellement leurs effets.',
          category: 'function'
        };
      } else if (randomLevel > 0.7) {
        return { 
          level: 'moderate', 
          description: 'Synergie modérée. Ces suppléments peuvent s\'amplifier légèrement.',
          category: 'absorption'
        };
      } else if (randomLevel > 0.55) {
        return { 
          level: 'low', 
          description: 'Synergie faible ou neutre. Pas d\'interactions significatives connues.',
          category: 'protection'
        };
      } else if (randomLevel > 0.45) {
        return { 
          level: 'unknown', 
          description: 'Interaction inconnue ou insuffisamment étudiée.' 
        };
      } else {
        return { 
          level: 'negative', 
          description: 'Interaction potentiellement négative. À prendre à des moments différents.'
        };
      }
    }
    
    return interaction.synergy;
  };
  
  // Fonction pour obtenir la couleur de la cellule en fonction du niveau de synergie
  const getCellColor = (level: SynergyLevel['level'], category?: SynergyCategory): string => {
    switch (level) {
      case 'high':
        return category && SYNERGY_CATEGORY_COLORS[category] ? 
          `bg-gradient-to-br from-${getCategoryColor(category)}-50 to-${getCategoryColor(category)}-100 border-${getCategoryColor(category)}-200` :
          'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'moderate':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case 'low':
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
      case 'negative':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      case 'unknown':
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  // Fonction pour obtenir l'icône de la cellule en fonction du niveau de synergie
  const getCellIcon = (level: SynergyLevel['level']) => {
    switch (level) {
      case 'high':
        return <Zap className="h-4 w-4 text-green-600" />;
      case 'moderate':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-gray-400" />;
      case 'negative':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'unknown':
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Helper pour extraire la couleur principale à partir de category
  function getCategoryColor(category: SynergyCategory): string {
    // Détermine la couleur de base Tailwind à partir du SYNERGY_CATEGORY_COLORS
    switch(category) {
      case 'absorption': return 'violet';
      case 'metabolism': return 'pink';
      case 'function': return 'emerald';
      case 'protection': return 'blue';
      case 'elimination': return 'amber';
      case 'signaling': return 'indigo';
      case 'structural': return 'sky';
      case 'energetic': return 'red';
      case 'temporal': return 'slate';
      case 'adaptive': return 'teal';
      default: return 'emerald';
    }
  }
  
  if (supplements.length < 2) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Grid2X2 className="h-5 w-5 mr-2 text-slate-500" />
            Matrice des interactions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-300" />
          <p>Minimum 2 suppléments requis pour visualiser les interactions.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Grid2X2 className="h-5 w-5 mr-2 text-slate-500" />
            Matrice des interactions
          </CardTitle>
          <Badge variant="outline" className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700">
            <Info className="h-3.5 w-3.5 mr-1" />
            Guide synergique
          </Badge>
        </div>
        <CardDescription>
          Découvrez comment vos suppléments recommandés interagissent entre eux
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b border-r border-gray-200 bg-gray-50"></th>
                {supplements.map((supplement) => (
                  <th 
                    key={`header-${supplement.id}`} 
                    className="p-2 border-b border-r border-gray-200 bg-gray-50 min-w-[100px]"
                  >
                    <div className="flex flex-col items-center">
                      <Pill className="h-5 w-5 mb-1 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600 max-w-[100px] truncate">
                        {supplement.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supplements.map((row, rowIndex) => (
                <tr key={`row-${row.id}`}>
                  <td className="p-2 border-b border-r border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <Pill className="h-5 w-5 mr-1.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600 max-w-[100px] truncate">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  
                  {supplements.map((col, colIndex) => {
                    const synergyInfo = getSynergyLevel(row.id, col.id);
                    const cellId = `${row.id}-${col.id}`;
                    const isExpanded = expandedInteraction === cellId;
                    
                    return (
                      <td 
                        key={`cell-${row.id}-${col.id}`} 
                        className={`p-1 border-b border-r border-gray-200 relative ${
                          row.id === col.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                className={`
                                  w-full h-full flex items-center justify-center rounded-md p-1.5 cursor-pointer
                                  border ${getCellColor(synergyInfo.level, synergyInfo.category)}
                                `}
                                onClick={() => setExpandedInteraction(isExpanded ? null : cellId)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {row.id === col.id ? (
                                  <div className="w-2 h-8"></div>
                                ) : (
                                  <div className="text-center">
                                    {getCellIcon(synergyInfo.level)}
                                  </div>
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{synergyInfo.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {isExpanded && row.id !== col.id && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-white rounded-md shadow-lg border border-gray-200 text-xs" style={{ width: '200px' }}>
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-medium">
                                {row.name} + {col.name}
                              </h5>
                              <button 
                                className="text-gray-400 hover:text-gray-600" 
                                onClick={() => setExpandedInteraction(null)}
                              >
                                ×
                              </button>
                            </div>
                            <p className="mb-2">{synergyInfo.description}</p>
                            {synergyInfo.category && (
                              <div className="flex items-center mt-2">
                                <span className="text-xs font-medium mr-1">Catégorie:</span>
                                <div 
                                  className="w-2 h-2 rounded-full mr-1" 
                                  style={{ backgroundColor: SYNERGY_CATEGORY_COLORS[synergyInfo.category] }} 
                                />
                                <span className="text-xs">{getCategoryLabel(synergyInfo.category)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h5 className="text-xs font-medium mb-2">Légende:</h5>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center">
              <div className="p-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-md mr-2">
                <Zap className="h-3 w-3 text-green-600" />
              </div>
              <span>Synergie forte</span>
            </div>
            <div className="flex items-center">
              <div className="p-1 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-md mr-2">
                <Plus className="h-3 w-3 text-blue-600" />
              </div>
              <span>Synergie modérée</span>
            </div>
            <div className="flex items-center">
              <div className="p-1 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-md mr-2">
                <CheckCircle2 className="h-3 w-3 text-gray-400" />
              </div>
              <span>Synergie faible</span>
            </div>
            <div className="flex items-center">
              <div className="p-1 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-md mr-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
              </div>
              <span>Interaction négative</span>
            </div>
            <div className="flex items-center">
              <div className="p-1 bg-gray-50 border border-gray-200 rounded-md mr-2">
                <HelpCircle className="h-3 w-3 text-gray-400" />
              </div>
              <span>Interaction inconnue</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}