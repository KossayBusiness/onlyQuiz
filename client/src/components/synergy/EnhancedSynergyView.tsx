import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Book, Zap, Network, Grid2X2, Pill, Calendar, Info, ArrowDown, BarChart3, ArrowUpRight, Activity } from 'lucide-react';
import { SynergyGraph } from './SynergyGraph';
import { SynergyMatrixView } from './SynergyMatrixView';
import { MetabolicEffectsView } from './MetabolicEffectsView';
import { generateRecommendations } from '@/lib/recommendationSystem';
import { getSupplement } from '@/data/supplementDatabase';
import { SYNERGY_PAIRS } from '@/data/supplementSynergies';
import { normalizeSupplementId } from '@/utils/supplementIdMapper';

/**
 * Composant amélioré pour la visualisation des synergies entre suppléments
 * Inclut plusieurs visualisations interactives et informations explicatives
 */
export function EnhancedSynergyView({ recommendations }: { recommendations: any }) {
  const [activeTab, setActiveTab] = useState('graph');
  
  // Logs pour le débogage
  useEffect(() => {
    console.log("Recommandations passées au composant Synergy:", recommendations);
    if (recommendations) {
      const primaryIds = recommendations.primaryRecommendations?.map(
        (rec: any) => rec.id
      ) || [];
    
      const secondaryIds = recommendations.secondaryRecommendations?.map(
        (rec: any) => rec.id
      ) || [];
      
      console.log("IDs primaires:", primaryIds);
      console.log("IDs secondaires:", secondaryIds);
    }
  }, [recommendations]);
  
  // Obtenir tous les suppléments recommandés (primaires et secondaires)
  const getAllRecommendedSupplements = () => {
    if (!recommendations) return [];
    
    const primaryIds = recommendations.primaryRecommendations?.map(
      (rec: any) => rec.id
    ) || [];
    
    const secondaryIds = recommendations.secondaryRecommendations?.map(
      (rec: any) => rec.id
    ) || [];
    
    return [...primaryIds, ...secondaryIds];
  };
  
  // Transformer les IDs en objets avec noms
  const getSupplementsWithNames = () => {
    const ids = getAllRecommendedSupplements();
    return ids.map(id => {
      const supplement = getSupplement(id);
      return {
        id,
        name: supplement?.name || id,
        description: supplement?.description || ''
      };
    });
  };
  
  // Générer des données de synergies pour les suppléments recommandés
  const generateSynergyData = () => {
    const ids = getAllRecommendedSupplements();
    const synergyData: Record<string, any[]> = {};
    
    // Afficher les IDs pour débogage
    console.log("IDs de suppléments recommandés:", ids);
    
    // Pour chaque paire de suppléments
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const id1 = ids[i];
        const id2 = ids[j];
        
        // Normaliser les identifiants pour la recherche de synergies
        const normalizedId1 = normalizeSupplementId(id1);
        const normalizedId2 = normalizeSupplementId(id2);
        
        console.log(`Recherche de synergie entre: ${id1}(${normalizedId1}) et ${id2}(${normalizedId2})`);
        
        // Clés dans les deux sens (utilisant les IDs originaux pour conserver la correspondance)
        const key1 = `${id1}-${id2}`;
        const key2 = `${id2}-${id1}`;
        
        // Chercher une synergie existante avec les IDs normalisés
        const synergy = SYNERGY_PAIRS.find(
          s => (s.pair[0] === normalizedId1 && s.pair[1] === normalizedId2) || 
               (s.pair[0] === normalizedId2 && s.pair[1] === normalizedId1)
        );
        
        if (synergy) {
          console.log(`Synergie trouvée: ${synergy.mechanism}`);
          synergyData[key1] = [{
            category: synergy.category,
            effect: 'synergistic',
            strength: synergy.synergyScore,
            mechanism: synergy.mechanism
          }];
          synergyData[key2] = synergyData[key1];
        }
      }
    }
    
    console.log("Données de synergies générées:", Object.keys(synergyData).length, "paires");
    return synergyData;
  };
  
  // Générer des interactions pour la matrice
  const generateInteractions = () => {
    const ids = getAllRecommendedSupplements();
    const interactions: any[] = [];
    
    // Pour chaque paire de suppléments
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const id1 = ids[i];
        const id2 = ids[j];
        
        // Normaliser les identifiants pour la recherche de synergies
        const normalizedId1 = normalizeSupplementId(id1);
        const normalizedId2 = normalizeSupplementId(id2);
        
        // Chercher une synergie existante avec les IDs normalisés
        const synergy = SYNERGY_PAIRS.find(
          s => (s.pair[0] === normalizedId1 && s.pair[1] === normalizedId2) || 
               (s.pair[0] === normalizedId2 && s.pair[1] === normalizedId1)
        );
        
        if (synergy) {
          let level: 'high' | 'moderate' | 'low' | 'negative' | 'unknown' = 'unknown';
          
          if (synergy.synergyScore >= 0.7) {
            level = 'high';
          } else if (synergy.synergyScore >= 0.5) {
            level = 'moderate';
          } else if (synergy.synergyScore >= 0.3) {
            level = 'low';
          } else if (synergy.synergyScore < 0) {
            level = 'negative';
          }
          
          interactions.push({
            supplement1: id1,
            supplement2: id2,
            synergy: {
              level,
              description: synergy.mechanism || synergy.effect || 'Interaction entre les suppléments',
              category: synergy.category
            }
          });
        }
      }
    }
    
    console.log("Nombre d'interactions générées pour la matrice:", interactions.length);
    return interactions;
  };
  
  const supplements = getSupplementsWithNames();
  const synergyData = generateSynergyData();
  const interactions = generateInteractions();
  
  const supplementNames = supplements.reduce((acc, sup) => {
    acc[sup.id] = sup.name;
    return acc;
  }, {} as Record<string, string>);
  
  const supplementDescriptions = supplements.reduce((acc, sup) => {
    acc[sup.id] = sup.description;
    return acc;
  }, {} as Record<string, string>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-800 flex items-center">
          <Zap className="mr-2 h-5 w-5" />
          Synergies entre vos compléments
        </h2>
      </div>
      
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Les synergies multiplient l'efficacité</AlertTitle>
        <AlertDescription className="text-blue-700">
          Des compléments bien associés peuvent avoir des effets jusqu'à 2,5 fois plus puissants qu'isolément.
          Nos recommandations tiennent compte de ces interactions synergiques pour maximiser les bénéfices.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="graph" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="graph" className="flex items-center">
            <Network className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Visualisation</span>
            <span className="sm:hidden">Visuel</span>
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center">
            <Grid2X2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Matrice</span>
            <span className="sm:hidden">Matrice</span>
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Effets métaboliques</span>
            <span className="sm:hidden">Effets</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center">
            <Book className="h-4 w-4 mr-2" />
            <span>Guide</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SynergyGraph 
              supplementIds={getAllRecommendedSupplements()}
              supplementNames={supplementNames}
              supplementDescriptions={supplementDescriptions}
              synergies={synergyData}
            />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                  Planification optimale
                </CardTitle>
                <CardDescription>
                  Timing idéal pour maximiser les synergies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Recommandations matin */}
                  <div>
                    <h4 className="text-sm font-medium mb-1 border-b pb-1">Matin</h4>
                    <div className="space-y-2">
                      {supplements.slice(0, 2).map(sup => (
                        <div key={`morning-${sup.id}`} className="flex justify-between text-sm p-2 bg-amber-50 rounded-lg border border-amber-100">
                          <div className="font-medium flex items-center">
                            <Pill className="h-4 w-4 mr-1.5 text-amber-600" />
                            {sup.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            Avec le petit-déjeuner
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommandations midi */}
                  <div>
                    <h4 className="text-sm font-medium mb-1 border-b pb-1">Midi</h4>
                    <div className="space-y-2">
                      {supplements.slice(2, 3).map(sup => (
                        <div key={`afternoon-${sup.id}`} className="flex justify-between text-sm p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="font-medium flex items-center">
                            <Pill className="h-4 w-4 mr-1.5 text-blue-600" />
                            {sup.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            Avec le déjeuner
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommandations soir */}
                  <div>
                    <h4 className="text-sm font-medium mb-1 border-b pb-1">Soir</h4>
                    <div className="space-y-2">
                      {supplements.slice(3, 5).map(sup => (
                        <div key={`evening-${sup.id}`} className="flex justify-between text-sm p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="font-medium flex items-center">
                            <Pill className="h-4 w-4 mr-1.5 text-indigo-600" />
                            {sup.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            Avant le coucher
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="matrix" className="mt-0">
          <SynergyMatrixView supplements={supplements} interactions={interactions} />
        </TabsContent>
        
        <TabsContent value="effects" className="mt-0">
          <MetabolicEffectsView
            supplementIds={getAllRecommendedSupplements()}
            supplementNames={supplementNames}
          />
        </TabsContent>
        
        <TabsContent value="info" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Book className="h-5 w-5 mr-2 text-blue-500" />
                Guide des synergies
              </CardTitle>
              <CardDescription>
                Comprendre comment les compléments interagissent entre eux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Qu'est-ce qu'une synergie?</h3>
                  <p className="text-sm text-gray-700">
                    Une synergie se produit lorsque deux ou plusieurs compléments combinés produisent un effet total supérieur 
                    à la somme de leurs effets individuels. En d'autres termes: 1+1=3. Ces interactions positives peuvent 
                    améliorer l'absorption, amplifier les effets thérapeutiques ou prolonger l'action des substances actives.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1.5 text-green-600" />
                      Types de synergies positives
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                        <span><strong>Amplification</strong>: Un complément augmente l'effet d'un autre</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                        <span><strong>Absorption</strong>: Amélioration de la biodisponibilité</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                        <span><strong>Protection</strong>: Réduction des effets secondaires</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                        <span><strong>Complémentarité</strong>: Action sur différentes voies pour un même résultat</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1.5 text-red-600" />
                      Interactions négatives à éviter
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                        <span><strong>Compétition</strong>: Lutte pour les mêmes transporteurs ou récepteurs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                        <span><strong>Inhibition</strong>: Un complément réduit l'effet d'un autre</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                        <span><strong>Chélation</strong>: Formation de complexes non absorbables</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                        <span><strong>Antagonisme</strong>: Effets opposés sur le même système</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Comment maximiser les synergies?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-blue-600" />
                        Timing optimal
                      </h4>
                      <p className="text-xs text-gray-700">
                        Certains compléments sont mieux absorbés à différents moments de la journée ou en fonction des repas.
                      </p>
                    </div>
                    
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1.5 text-emerald-600" />
                        Dosage équilibré
                      </h4>
                      <p className="text-xs text-gray-700">
                        Les ratios entre différents nutriments peuvent être aussi importants que les doses absolues.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Pill className="h-4 w-4 mr-1.5 text-amber-600" />
                        Qualité des formulations
                      </h4>
                      <p className="text-xs text-gray-700">
                        Des formulations biodisponibles et de haute qualité amplifient les synergies potentielles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}