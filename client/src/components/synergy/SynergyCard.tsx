/**
 * Composant pour l'affichage visuel d'une synergie entre deux suppléments
 * Présente les détails de la synergie de manière intuitive et esthétique
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info, ChevronDown, ChevronUp, AlertTriangle, Award, Pill, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface SynergyCardProps {
  supplement1: {
    id: string;
    name: string;
    description?: string;
    image?: string;
  };
  supplement2: {
    id: string;
    name: string;
    description?: string;
    image?: string;
  };
  synergyEffect: number; // Multiplicateur d'effet (ex: 1.5 = +50%)
  mechanism: string;
  evidenceLevel: string;
  description?: string;
  optimalTiming?: string;
  targetedConditions?: string[];
}

export function SynergyCard({
  supplement1,
  supplement2,
  synergyEffect,
  mechanism,
  evidenceLevel,
  description,
  optimalTiming,
  targetedConditions
}: SynergyCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Calculer le pourcentage d'amélioration et la force de la synergie
  const effectPercentage = Math.round((synergyEffect - 1) * 100);
  const synergyStrength = effectPercentage < 30 ? 'faible' : effectPercentage < 50 ? 'modérée' : 'forte';
  
  // Mappage des niveaux de preuve aux couleurs et labels
  const evidenceLevelData = {
    'strong': { color: 'bg-green-100 text-green-800', label: 'Fort' },
    'moderate': { color: 'bg-blue-100 text-blue-800', label: 'Modéré' },
    'limited': { color: 'bg-amber-100 text-amber-800', label: 'Limité' },
    'theoretical': { color: 'bg-purple-100 text-purple-800', label: 'Théorique' },
    'none': { color: 'bg-gray-100 text-gray-800', label: 'Non documenté' }
  };
  
  // Déterminer les données du niveau de preuve
  const evidenceData = evidenceLevelData[evidenceLevel as keyof typeof evidenceLevelData] || 
                      evidenceLevelData.none;
  
  // Déterminer la couleur de fond en fonction de la force de la synergie
  const bgGradient = 
    synergyStrength === 'forte' 
      ? 'from-red-50 to-orange-50 border-red-200' 
      : synergyStrength === 'modérée'
        ? 'from-amber-50 to-yellow-50 border-amber-200'
        : 'from-blue-50 to-green-50 border-blue-200';
  
  return (
    <Card className={`overflow-hidden border ${expanded ? 'shadow-md' : ''}`}>
      <CardHeader className={`bg-gradient-to-r ${bgGradient} py-3 px-4`}>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <Zap className={`h-5 w-5 mr-2 ${
                synergyStrength === 'forte' ? 'text-red-500' : 
                synergyStrength === 'modérée' ? 'text-amber-500' : 
                'text-blue-500'
              }`} />
              <CardTitle className="text-base">
                Synergie {synergyStrength}
              </CardTitle>
            </div>
          </div>
          
          <Badge className={`${
            synergyStrength === 'forte' ? 'bg-red-100 text-red-800 border-red-200' : 
            synergyStrength === 'modérée' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
            'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            +{effectPercentage}% d'efficacité
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-white p-2 rounded-md border border-gray-100 flex items-center">
            <span className="p-1.5 rounded-full bg-indigo-100 mr-2">
              <Pill className="h-4 w-4 text-indigo-600" />
            </span>
            <div className="text-sm font-medium text-gray-800">{supplement1.name}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-0.5 w-6 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
            <Zap className="h-4 w-4 text-purple-500 my-1" />
            <div className="h-0.5 w-6 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
          </div>
          
          <div className="flex-1 bg-white p-2 rounded-md border border-gray-100 flex items-center">
            <span className="p-1.5 rounded-full bg-indigo-100 mr-2">
              <Pill className="h-4 w-4 text-indigo-600" />
            </span>
            <div className="text-sm font-medium text-gray-800">{supplement2.name}</div>
          </div>
        </div>
        
        <div className="bg-white p-2.5 rounded-md border border-gray-100 mb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-gray-500 mr-1.5" />
              <div className="text-sm font-medium text-gray-700">Mécanisme</div>
            </div>
            
            <Badge variant="outline" className={evidenceData.color}>
              Preuve {evidenceData.label}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600">
            {mechanism}
          </p>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* Timing optimal */}
              {optimalTiming && (
                <div className="bg-white p-2.5 rounded-md border border-gray-100 mb-2">
                  <div className="flex items-center mb-1.5">
                    <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
                    <div className="text-sm font-medium text-gray-700">Timing optimal</div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {optimalTiming}
                  </p>
                </div>
              )}
              
              {/* Conditions ciblées */}
              {targetedConditions && targetedConditions.length > 0 && (
                <div className="bg-white p-2.5 rounded-md border border-gray-100 mb-2">
                  <div className="flex items-center mb-1.5">
                    <Award className="h-4 w-4 text-gray-500 mr-1.5" />
                    <div className="text-sm font-medium text-gray-700">Conditions ciblées</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {targetedConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description détaillée */}
              {description && (
                <div className="bg-white p-2.5 rounded-md border border-gray-100 mb-2">
                  <div className="flex items-center mb-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                    <div className="text-sm font-medium text-gray-700">Précisions importantes</div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {description}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="p-2 bg-gray-50 flex justify-center">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs h-8 text-gray-600"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
              Réduire les détails
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 mr-1" />
              Voir plus de détails
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}