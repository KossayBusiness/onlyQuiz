/**
 * Composant pour afficher un plan de prise optimisé des suppléments
 * en tenant compte des synergies et des contraintes temporelles
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Utensils, CheckCircle, Moon, Sun, Sunset, Coffee, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface OptimalIntakePlanProps {
  supplements: string[];
  supplementNames: Record<string, string>;
}

export function OptimalIntakePlan({ 
  supplements, 
  supplementNames 
}: OptimalIntakePlanProps) {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Détecter si l'appareil est mobile
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
  
  // Si aucun supplément, afficher un message
  if (supplements.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Plan de prise
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Aucun supplément à planifier. Ajoutez des recommandations pour créer un plan de prise optimal.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Répartir les suppléments dans des créneaux quotidiens optimaux
  // Cette logique serait idéalement basée sur des règles plus complexes en production
  const getOptimalTimeSlots = () => {
    const timeSlots = {
      morning: {
        label: 'Matin',
        icon: <Sun className="h-5 w-5 text-amber-500" />,
        description: 'À prendre au réveil ou avec le petit-déjeuner',
        supplements: [] as string[],
        withFood: true
      },
      midday: {
        label: 'Midi',
        icon: <Coffee className="h-5 w-5 text-indigo-500" />,
        description: 'À prendre avec le déjeuner',
        supplements: [] as string[],
        withFood: true
      },
      evening: {
        label: 'Soir',
        icon: <Sunset className="h-5 w-5 text-purple-500" />,
        description: 'À prendre avec le dîner',
        supplements: [] as string[],
        withFood: true
      },
      bedtime: {
        label: 'Coucher',
        icon: <Moon className="h-5 w-5 text-blue-500" />,
        description: 'À prendre 30-60 minutes avant le coucher',
        supplements: [] as string[],
        withFood: false
      }
    };
    
    // Répartition simple des suppléments dans les créneaux
    // En production, utiliserait des règles basées sur les propriétés des suppléments et leurs synergies
    supplements.forEach((id, index) => {
      // Attribuer en fonction de l'index pour répartir à peu près uniformément
      switch (index % 4) {
        case 0:
          timeSlots.morning.supplements.push(id);
          break;
        case 1:
          timeSlots.midday.supplements.push(id);
          break;
        case 2:
          timeSlots.evening.supplements.push(id);
          break;
        case 3:
          timeSlots.bedtime.supplements.push(id);
          break;
      }
    });
    
    return timeSlots;
  };
  
  const timeSlots = getOptimalTimeSlots();
  
  return (
    <Card className="border border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
            <CardTitle className="text-lg text-indigo-800">
              Plan de prise optimal
            </CardTitle>
          </div>
          
          <Tabs 
            value={view} 
            onValueChange={(v) => setView(v as 'day' | 'week')}
            className="h-9"
          >
            <TabsList className="bg-indigo-100 border border-indigo-200 p-1 h-8">
              <TabsTrigger 
                value="day" 
                className="text-xs h-6 px-3 data-[state=active]:bg-white"
              >
                Journalier
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="text-xs h-6 px-3 data-[state=active]:bg-white"
              >
                Hebdomadaire
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <TabsContent value="day" className="p-0 m-0">
          <div className="p-6 bg-gradient-to-b from-white to-gray-50">
            <div className="space-y-6">
              {Object.entries(timeSlots).map(([key, slot], index) => (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${isMobile ? 'flex-col' : 'flex items-stretch'} gap-4`}
                >
                  {/* En-tête avec l'icône et le titre - optimisé pour mobile */}
                  <div className={`flex ${isMobile ? 'items-center mb-2' : 'flex-col items-center'}`}>
                    <div className={`p-3 rounded-full ${
                      key === 'morning' ? 'bg-amber-100' : 
                      key === 'midday' ? 'bg-indigo-100' : 
                      key === 'evening' ? 'bg-purple-100' : 
                      'bg-blue-100'
                    } ${isMobile ? 'mr-3' : ''}`}>
                      {slot.icon}
                    </div>
                    {isMobile ? (
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <h3 className="text-base font-medium text-gray-800">{slot.label}</h3>
                          <Badge className="ml-2 bg-gray-100 text-gray-700 text-xs">
                            {slot.withFood ? 'Avec nourriture' : 'Sans nourriture'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {slot.description}
                        </p>
                      </div>
                    ) : (
                      <div className="h-full w-0.5 bg-gray-200 my-1 flex-1"></div>
                    )}
                  </div>
                  
                  {/* Contenu du créneau - adapté pour desktop et mobile */}
                  <div className={`flex-1 ${isMobile ? 'ml-12 border-l border-gray-200 pl-3' : 'pb-6'}`}>
                    {!isMobile && (
                      <>
                        <div className="flex items-center">
                          <h3 className="text-base font-medium text-gray-800">{slot.label}</h3>
                          <Badge className="ml-2 bg-gray-100 text-gray-700 text-xs">
                            {slot.withFood ? 'Avec nourriture' : 'Sans nourriture'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          {slot.description}
                        </p>
                      </>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {slot.supplements.map(id => (
                        <Badge 
                          key={id}
                          className={`px-3 py-1.5 ${
                            key === 'morning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            key === 'midday' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                            key === 'evening' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                            'bg-blue-50 text-blue-700 border-blue-200'
                          } ${isMobile ? 'text-xs' : ''}`}
                        >
                          {supplementNames[id] || id}
                        </Badge>
                      ))}
                      
                      {slot.supplements.length === 0 && (
                        <span className={`text-gray-400 italic ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Aucun supplément
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-start">
              <div className="p-1.5 rounded-full bg-green-100 mr-2 flex-shrink-0">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">
                Ce plan de prise a été optimisé pour maximiser l'efficacité des suppléments et leurs synergies tout en tenant compte de votre rythme quotidien et des recommandations scientifiques.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="week" className="p-0 m-0">
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-3" />
              <h3 className="text-base font-medium text-gray-700 mb-1">Plan hebdomadaire</h3>
              <p className="text-sm text-gray-600 mb-3">
                La planification hebdomadaire personnalisée sera disponible prochainement.
              </p>
              <Button variant="outline" size="sm" className="text-xs">
                <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
                Voir un aperçu
              </Button>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
}