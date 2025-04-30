/**
 * Composant pour présenter des insights visuels sur les synergies
 * avec informations explicatives et scientifiques
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Beaker, Brain, Pill, BookOpen, HelpCircle, ArrowUpRight, 
  CheckCircle2, FileText, BarChart3, ChevronDown, ChevronRight
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Types pour les insights
interface SynergyInsight {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  supplements: string[];
  score: number;
  mechanismExplanation: string;
  scientificSummary: string;
  references?: string[];
}

interface SynergyCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface SynergyInsightsProps {
  supplements: string[];
  supplementNames: Record<string, string>;
  insights?: SynergyInsight[];
  synergyMultiplier: number;
}

export function SynergyInsights({
  supplements,
  supplementNames,
  insights = [],
  synergyMultiplier
}: SynergyInsightsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Détecter le type d'appareil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Catégories de synergies
  const categories: SynergyCategory[] = [
    {
      id: 'absorption',
      name: 'Amélioration de l\'absorption',
      icon: <Beaker className="text-orange-500 h-5 w-5" />,
      description: 'Mécanismes qui augmentent la biodisponibilité et l\'absorption des nutriments actifs.'
    },
    {
      id: 'potentiation',
      name: 'Potentialisation d\'effets',
      icon: <ArrowUpRight className="text-indigo-500 h-5 w-5" />,
      description: 'Amplification mutuelle des effets biologiques et thérapeutiques.'
    },
    {
      id: 'protection',
      name: 'Protection biologique',
      icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
      description: 'Protection contre la dégradation et le stress oxydatif.'
    },
    {
      id: 'pathway',
      name: 'Activation de voies complémentaires',
      icon: <Brain className="text-purple-500 h-5 w-5" />,
      description: 'Action sur différentes voies biologiques pour un effet global optimisé.'
    }
  ];
  
  // Si pas d'insights fournis, générer des exemples fictifs
  const effectiveInsights = insights.length > 0 ? insights : generatePlaceholderInsights();
  
  // Filtrer les insights par catégorie active
  const filteredInsights = activeCategory
    ? effectiveInsights.filter(insight => insight.id.startsWith(activeCategory))
    : effectiveInsights;
  
  // Créer une fonction pour basculer l'expansion d'un insight
  const toggleInsightExpansion = (id: string) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };
  
  // Version mobile
  if (isMobile) {
    return (
      <Card className="border border-indigo-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base text-indigo-800">
                Synergies Détectées
              </CardTitle>
              <CardDescription className="text-xs text-indigo-500">
                +{Math.round((synergyMultiplier - 1) * 100)}% d'efficacité globale
              </CardDescription>
            </div>
            <Badge className="bg-indigo-600">
              {effectiveInsights.length} insights
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="px-3 py-4">
          <Accordion type="single" collapsible className="space-y-2">
            {effectiveInsights.map((insight, index) => (
              <AccordionItem 
                key={insight.id} 
                value={insight.id}
                className="border border-gray-100 rounded-md overflow-hidden"
              >
                <AccordionTrigger className="px-3 py-2 hover:no-underline text-left">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-indigo-50 flex-shrink-0">
                      {insight.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">
                        {insight.title}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Badge className="text-xs bg-indigo-50 text-indigo-700 font-normal">
                          +{Math.round(insight.score * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 text-xs">
                  <p className="text-gray-600 mb-2">
                    {insight.description}
                  </p>
                  
                  <div className="flex gap-1 flex-wrap mb-2">
                    {insight.supplements.map(supp => (
                      <Badge 
                        key={supp} 
                        variant="outline" 
                        className="text-[0.65rem] bg-gray-50"
                      >
                        {supplementNames[supp] || supp}
                      </Badge>
                    ))}
                  </div>
                  
                  <Accordion type="single" collapsible>
                    <AccordionItem value="mechanism">
                      <AccordionTrigger className="py-1.5 text-[0.7rem] text-indigo-700">
                        Mécanisme scientifique
                      </AccordionTrigger>
                      <AccordionContent className="text-[0.7rem] text-gray-600">
                        {insight.mechanismExplanation}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    );
  }
  
  // Version desktop
  return (
    <Card className="border border-indigo-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-indigo-800">
              Analyse des Synergies Nutritionnelles
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Les interactions bénéfiques entre vos suppléments augmentent leur efficacité de {Math.round((synergyMultiplier - 1) * 100)}%
            </CardDescription>
          </div>
          <Badge className="bg-indigo-600">
            {effectiveInsights.length} insights détectés
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex">
          {/* Navigation par catégorie */}
          <div className="w-1/4 border-r border-gray-100 p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Catégories de Synergies
            </h4>
            
            <div className="space-y-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                className="w-full justify-start h-auto py-2"
                onClick={() => setActiveCategory(null)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>Tous les insights</span>
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="w-full justify-start h-auto py-2"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
            
            {activeCategory && (
              <div className="mt-4 p-3 bg-white border border-gray-100 rounded-md text-xs">
                <h5 className="font-medium text-gray-700 mb-1">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h5>
                <p className="text-gray-600">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
            )}
          </div>
          
          {/* Liste des insights */}
          <div className="w-3/4 p-4">
            <div className="space-y-4">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`border ${
                        expandedInsight === insight.id
                          ? 'border-indigo-200 shadow-sm'
                          : 'border-gray-100'
                      }`}
                    >
                      {/* En-tête de l'insight */}
                      <div 
                        className="p-4 flex items-start cursor-pointer"
                        onClick={() => toggleInsightExpansion(insight.id)}
                      >
                        <div className={`p-2 rounded-full ${
                          insight.score > 0.3 ? 'bg-indigo-100' : 'bg-gray-100'
                        } mr-3 flex-shrink-0`}>
                          {insight.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">
                              {insight.title}
                            </h4>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={insight.score > 0.3
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-gray-100 text-gray-800'
                              }>
                                +{Math.round(insight.score * 100)}%
                              </Badge>
                              
                              {expandedInsight === insight.id ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.description}
                          </p>
                          
                          <div className="flex gap-1 flex-wrap mt-2">
                            {insight.supplements.map(supp => (
                              <Badge 
                                key={supp} 
                                variant="outline" 
                                className="text-xs bg-gray-50"
                              >
                                {supplementNames[supp] || supp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Contenu détaillé (affiché si l'insight est étendu) */}
                      {expandedInsight === insight.id && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                          <Tabs defaultValue="mechanism">
                            <TabsList className="mb-3">
                              <TabsTrigger value="mechanism">
                                <Beaker className="h-3.5 w-3.5 mr-1.5" />
                                Mécanisme
                              </TabsTrigger>
                              <TabsTrigger value="science">
                                <FileText className="h-3.5 w-3.5 mr-1.5" />
                                Données scientifiques
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="mechanism" className="mt-0">
                              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-md text-sm">
                                {insight.mechanismExplanation}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="science" className="mt-0">
                              <div className="text-sm text-gray-700">
                                <p className="mb-2">
                                  {insight.scientificSummary}
                                </p>
                                
                                {insight.references && insight.references.length > 0 && (
                                  <div className="mt-3">
                                    <h5 className="text-xs font-medium text-gray-500 mb-1">
                                      Références scientifiques:
                                    </h5>
                                    <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                                      {insight.references.map((ref, i) => (
                                        <li key={i}>{ref}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-md">
                  <HelpCircle className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-gray-700 font-medium mb-1">
                    Aucun insight dans cette catégorie
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Les suppléments sélectionnés ne présentent pas de synergie notable dans cette catégorie.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => setActiveCategory(null)}
                  >
                    Voir toutes les catégories
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Génère des insights de démonstration
 */
function generatePlaceholderInsights(): SynergyInsight[] {
  return [
    {
      id: 'absorption_vitD_magnesium',
      title: 'Synergie d\'absorption Vitamine D-Magnésium',
      description: 'La vitamine D améliore l\'absorption du magnésium et le magnésium est nécessaire à l\'activation de la vitamine D.',
      icon: <Beaker className="h-4 w-4 text-orange-500" />,
      supplements: ['vitaminD', 'magnesium'],
      score: 0.45,
      mechanismExplanation: 'La vitamine D stimule l\'expression des transporteurs de magnésium TRPM6/TRPM7 dans l\'intestin et les reins, tandis que le magnésium est un cofacteur essentiel des enzymes qui métabolisent la vitamine D en sa forme active 1,25-dihydroxyvitamine D.',
      scientificSummary: 'Des études cliniques ont démontré que la correction d\'une carence en magnésium est souvent nécessaire pour normaliser les niveaux de vitamine D, même lors d\'une supplémentation en vitamine D à doses adéquates.',
      references: [
        'Rosanoff, A., et al. (2016). "Essential Nutrient Interactions: Does Low or Suboptimal Magnesium Status Interact with Vitamin D and/or Calcium Status?"',
        'Uwitonze, A.M., et al. (2018). "Role of Magnesium in Vitamin D Activation and Function"'
      ]
    },
    {
      id: 'potentiation_omega3_curcumin',
      title: 'Potentialisation anti-inflammatoire Oméga-3/Curcumine',
      description: 'Les acides gras oméga-3 et la curcumine ciblent différentes voies de l\'inflammation, créant un effet synergique sur la réduction de l\'inflammation systémique.',
      icon: <ArrowUpRight className="h-4 w-4 text-indigo-500" />,
      supplements: ['omega3', 'curcumin'],
      score: 0.55,
      mechanismExplanation: 'Les oméga-3 inhibent la voie de la cyclooxygénase (COX) et produisent des médiateurs anti-inflammatoires comme les résolvines, tandis que la curcumine inhibe le facteur de transcription NF-κB et d\'autres voies inflammatoires. Ensemble, ils créent un effet multi-cible sur l\'inflammation.',
      scientificSummary: 'Des études cliniques ont montré que cette combinaison réduit significativement les marqueurs inflammatoires comme la CRP, les IL-6 et TNF-α, avec des effets supérieurs à chaque supplément utilisé isolément.',
      references: [
        'Calder, P.C. (2015). "Marine omega-3 fatty acids and inflammatory processes: Effects, mechanisms and clinical relevance"',
        'Hewlings, S.J., et al. (2017). "Curcumin: A Review of Its' Effects on Human Health"'
      ]
    },
    {
      id: 'pathway_ashwagandha_rhodiola',
      title: 'Modulation adaptogène complémentaire',
      description: 'L\'ashwagandha et la rhodiola agissent sur des aspects complémentaires de l\'adaptation au stress, créant une réponse plus complète et équilibrée.',
      icon: <Brain className="h-4 w-4 text-purple-500" />,
      supplements: ['ashwagandha', 'rhodiola'],
      score: 0.35,
      mechanismExplanation: 'L\'ashwagandha module principalement l\'axe HPA et réduit le cortisol, tandis que la rhodiola améliore la résistance à la fatigue mentale via la modulation des neurotransmetteurs (noradrénaline, sérotonine, dopamine) et la production d\'ATP.',
      scientificSummary: 'Des observations cliniques suggèrent que cette combinaison offre à la fois une réduction du stress perçu et une amélioration de l\'endurance cognitive, deux aspects complémentaires de la résistance au stress.',
      references: [
        'Panossian, A., et al. (2010). "Adaptogens stimulate neuropeptide Y and Hsp72 expression and release in neuroglia cells"',
        'Chandrasekhar, K., et al. (2012). "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults"'
      ]
    },
    {
      id: 'protection_vitaminC_quercetin',
      title: 'Protection antioxydante régénératrice',
      description: 'La quercétine et la vitamine C forment un système régénératif qui potentialise leurs effets antioxydants respectifs.',
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      supplements: ['vitaminC', 'quercetin'],
      score: 0.40,
      mechanismExplanation: 'Après avoir neutralisé un radical libre, la quercétine oxydée peut être régénérée par la vitamine C, qui elle-même peut être régénérée par d\'autres systèmes. Ce cycle de régénération prolonge et amplifie l\'effet antioxydant des deux composés.',
      scientificSummary: 'Des études in vitro et in vivo ont démontré que cette combinaison offre une protection antioxydante significativement supérieure à chaque composant utilisé séparément, notamment contre le stress oxydatif induit par divers facteurs environnementaux.',
      references: [
        'Boots, A.W., et al. (2008). "Health effects of quercetin: from antioxidant to nutraceutical"',
        'Colunga Biancatelli, R.M.L., et al. (2020). "Quercetin and Vitamin C: An Experimental, Synergistic Therapy for the Prevention and Treatment of SARS-CoV-2 Related Disease (COVID-19)"'
      ]
    }
  ];
}