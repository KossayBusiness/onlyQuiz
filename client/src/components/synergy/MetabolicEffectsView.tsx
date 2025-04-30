import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  Heart, 
  Stethoscope, 
  ShieldCheck, 
  Flame, 
  Droplet, 
  Microscope, 
  Dna,
  Pill,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Types pour les profils métaboliques
interface MetabolicSystem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  baselineLevel: number; // 0-100
  enhancedLevel: number; // 0-100
  color: string;
}

interface SupplementEffect {
  supplementId: string;
  supplementName: string;
  systemId: string;
  impactPercentage: number; // 0-100
}

interface MetabolicEffectsViewProps {
  supplementIds: string[];
  supplementNames: Record<string, string>;
  className?: string;
}

export function MetabolicEffectsView({
  supplementIds,
  supplementNames,
  className = ''
}: MetabolicEffectsViewProps) {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  
  // Systèmes métaboliques à visualiser
  const metabolicSystems: MetabolicSystem[] = [
    {
      id: 'neuro',
      name: 'Système neurologique',
      icon: <Brain className="h-6 w-6" />,
      description: 'Fonctions cérébrales, neurotransmetteurs et santé cognitive',
      baselineLevel: 65,
      enhancedLevel: 87,
      color: 'indigo'
    },
    {
      id: 'cardio',
      name: 'Système cardiovasculaire',
      icon: <Heart className="h-6 w-6" />,
      description: 'Santé du cœur, circulation et fonction vasculaire',
      baselineLevel: 72,
      enhancedLevel: 84,
      color: 'red'
    },
    {
      id: 'immune',
      name: 'Système immunitaire',
      icon: <ShieldCheck className="h-6 w-6" />,
      description: 'Défenses immunitaires et réponse inflammatoire',
      baselineLevel: 58,
      enhancedLevel: 81,
      color: 'blue'
    },
    {
      id: 'energy',
      name: 'Métabolisme énergétique',
      icon: <Flame className="h-6 w-6" />,
      description: 'Production d\'énergie et métabolisme mitochondrial',
      baselineLevel: 55,
      enhancedLevel: 83,
      color: 'amber'
    },
    {
      id: 'detox',
      name: 'Système de détoxification',
      icon: <Droplet className="h-6 w-6" />,
      description: 'Élimination des toxines et fonction hépatique',
      baselineLevel: 63,
      enhancedLevel: 79,
      color: 'emerald'
    },
    {
      id: 'hormone',
      name: 'Équilibre hormonal',
      icon: <Dna className="h-6 w-6" />,
      description: 'Régulation endocrinienne et équilibre hormonal',
      baselineLevel: 61,
      enhancedLevel: 82,
      color: 'violet'
    }
  ];
  
  // Effets simulés des suppléments sur les systèmes métaboliques
  const generateSupplementEffects = (): SupplementEffect[] => {
    if (supplementIds.length === 0) return [];
    
    const effects: SupplementEffect[] = [];
    
    supplementIds.forEach(id => {
      // Générer 2-3 effets par supplément sur différents systèmes
      const numEffects = Math.floor(Math.random() * 2) + 2;
      const systemIndices = new Set<number>();
      
      // Sélectionner des systèmes aléatoires sans répétition
      while (systemIndices.size < numEffects && systemIndices.size < metabolicSystems.length) {
        const idx = Math.floor(Math.random() * metabolicSystems.length);
        systemIndices.add(idx);
      }
      
      // Créer les effets pour ce supplément
      Array.from(systemIndices).forEach(idx => {
        const system = metabolicSystems[idx];
        effects.push({
          supplementId: id,
          supplementName: supplementNames[id] || id,
          systemId: system.id,
          impactPercentage: Math.floor(Math.random() * 25) + 5 // 5-30%
        });
      });
    });
    
    return effects;
  };
  
  const supplementEffects = generateSupplementEffects();
  
  // Obtenir les effets pour un système spécifique
  const getEffectsForSystem = (systemId: string) => {
    return supplementEffects.filter(effect => effect.systemId === systemId);
  };
  
  // Calculer la contribution combinée en tenant compte des synergies
  const calculateCombinedContribution = (effects: SupplementEffect[]) => {
    if (effects.length === 0) return 0;
    
    // Base: somme directe
    const directSum = effects.reduce((sum, effect) => sum + effect.impactPercentage, 0);
    
    // Facteur synergique (augmente avec le nombre de suppléments)
    const synergyFactor = 1 + (effects.length - 1) * 0.15;
    
    // Contribution combinée avec effet synergique (plafonné)
    return Math.min(100, directSum * synergyFactor);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-purple-500" />
          Effets synergiques métaboliques
        </CardTitle>
        <CardDescription>
          Visualisez comment les suppléments travaillent ensemble pour soutenir les différents systèmes de votre corps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Vue d'ensemble des systèmes métaboliques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metabolicSystems.map(system => {
              const isSelected = selectedSystem === system.id;
              const effects = getEffectsForSystem(system.id);
              const hasEffects = effects.length > 0;
              
              return (
                <motion.div
                  key={system.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    rounded-lg p-4 border cursor-pointer transition-all duration-300
                    ${isSelected ? `bg-${system.color}-50 border-${system.color}-200` : 'bg-gray-50 border-gray-200'}
                    ${hasEffects ? `hover:border-${system.color}-300` : 'opacity-70'}
                  `}
                  onClick={() => setSelectedSystem(isSelected ? null : system.id)}
                >
                  <div className="flex items-start">
                    <div className={`p-2.5 rounded-full bg-${system.color}-100 text-${system.color}-600 mr-3`}>
                      {system.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-1">{system.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${system.color}-500`}
                            style={{ width: `${system.baselineLevel}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">Base</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r from-${system.color}-500 to-${system.color}-300`}
                            style={{ width: `${system.enhancedLevel}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">Amélioré</span>
                      </div>
                      
                      {hasEffects && (
                        <div className="mt-2 text-xs text-gray-600">
                          {effects.length} supplément{effects.length > 1 ? 's' : ''} actif{effects.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Détails du système sélectionné */}
          {selectedSystem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {(() => {
                const system = metabolicSystems.find(s => s.id === selectedSystem);
                if (!system) return null;
                
                const effects = getEffectsForSystem(system.id);
                const combinedContribution = calculateCombinedContribution(effects);
                
                return (
                  <div className={`p-4 rounded-lg border border-${system.color}-200 bg-${system.color}-50`}>
                    <h3 className="text-base font-medium mb-2 flex items-center">
                      <div className={`p-1.5 rounded-full bg-${system.color}-100 text-${system.color}-700 mr-2`}>
                        {system.icon}
                      </div>
                      {system.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">{system.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Amélioration globale</span>
                        <span className="text-xs font-medium text-gray-700">
                          +{(system.enhancedLevel - system.baselineLevel).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${system.color}-100`}
                          style={{ width: `${system.baselineLevel}%` }}
                        />
                        <div 
                          className={`h-full bg-gradient-to-r from-${system.color}-500 to-${system.color}-300`}
                          style={{ 
                            width: `${system.enhancedLevel - system.baselineLevel}%`,
                            marginLeft: `${system.baselineLevel}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium mb-2">Contributions des suppléments:</h4>
                    
                    {effects.length > 0 ? (
                      <div className="space-y-2">
                        {effects.map((effect, index) => (
                          <div 
                            key={`${effect.supplementId}-${index}`}
                            className="flex items-center bg-white rounded-lg p-2 border border-gray-200"
                          >
                            <Pill className={`h-4 w-4 mr-2 text-${system.color}-500`} />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{effect.supplementName}</span>
                                <span>+{effect.impactPercentage}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex items-center justify-center my-2">
                          <div className="w-8 h-px bg-gray-200" />
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                          <div className="w-8 h-px bg-gray-200" />
                        </div>
                        
                        <div className="flex items-center bg-gradient-to-r from-gray-50 to-white rounded-lg p-2 border border-gray-200">
                          <div className={`p-1 rounded-full bg-${system.color}-100 mr-2`}>
                            <Microscope className={`h-4 w-4 text-${system.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Effet synergique combiné</span>
                              <span className="font-bold text-emerald-600">+{combinedContribution.toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-sm text-gray-500 italic">
                        Aucun effet direct détecté pour ce système
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
          
          {!selectedSystem && supplementIds.length > 0 && (
            <div className="text-center py-2 text-sm text-gray-500">
              Sélectionnez un système pour voir les détails des effets synergiques
            </div>
          )}
          
          {supplementIds.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Stethoscope className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun supplément sélectionné pour analyser les effets métaboliques</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}