/**
 * Composant pour afficher le réseau de synergies entre suppléments
 * Version simplifiée du graphe interactif pour une meilleure lisibilité
 */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Maximize2, Plus, Minus, ZoomIn, ZoomOut, RefreshCw, Pill } from 'lucide-react';

interface SynergyNetworkProps {
  supplements: string[];
  supplementNames: Record<string, string>;
  synergyResult: {
    synergyPairs: Array<{
      pair: [string, string];
      effect: number;
      mechanism: string;
      evidenceLevel: string;
    }>;
    effectivenessMultiplier: number;
    keySupplements?: string[];
  };
  onSupplementClick?: (id: string) => void;
}

export function SynergyNetwork({
  supplements,
  supplementNames,
  synergyResult,
  onSupplementClick
}: SynergyNetworkProps) {
  const [activeSupplement, setActiveSupplement] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Détection de l'appareil
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
  
  // Filtrer les paires pour un supplément actif
  const getConnections = useCallback((supplementId: string) => {
    return synergyResult.synergyPairs
      .filter(pair => pair.pair[0] === supplementId || pair.pair[1] === supplementId)
      .map(pair => {
        const otherSupplementId = pair.pair[0] === supplementId ? pair.pair[1] : pair.pair[0];
        return {
          id: otherSupplementId,
          name: supplementNames[otherSupplementId] || otherSupplementId,
          effect: pair.effect,
          mechanism: pair.mechanism,
          evidenceLevel: pair.evidenceLevel
        };
      });
  }, [synergyResult.synergyPairs, supplementNames]);
  
  // Gérer le clic sur un supplément
  const handleSupplementClick = (id: string) => {
    setActiveSupplement(prevId => prevId === id ? null : id);
    if (onSupplementClick) {
      onSupplementClick(id);
    }
  };
  
  // En-tête avec titre et compteurs
  const renderHeader = () => (
    <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-blue-50 flex justify-between items-center flex-wrap">
      <div>
        <h3 className="text-lg font-medium text-indigo-800">Réseau des synergies</h3>
        <p className="text-sm text-indigo-600">
          Visualisation des interactions entre vos suppléments recommandés
        </p>
      </div>
      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
        <Network className="h-3.5 w-3.5 mr-1.5" />
        {synergyResult.synergyPairs.length} interactions
      </Badge>
    </div>
  );
  
  // Effet global des synergies
  const renderOverallEffect = () => (
    <div className="p-4 bg-gradient-to-b from-indigo-50 to-white border-b">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-indigo-800">Effet synergique global</h4>
          <p className="text-xs text-indigo-600">Potentialisation de l'efficacité</p>
        </div>
        <div className="text-lg font-bold text-indigo-700">
          +{Math.round((synergyResult.effectivenessMultiplier - 1) * 100)}%
        </div>
      </div>
    </div>
  );
  
  // Affichage des suppléments en colonnes
  const renderSupplementsDesktop = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
      {supplements.map((id, index) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant={activeSupplement === id ? "default" : "outline"}
            className={`h-auto py-3 px-4 w-full justify-start text-left ${
              activeSupplement === id 
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "border-indigo-100 bg-white hover:bg-indigo-50"
            }`}
            onClick={() => handleSupplementClick(id)}
          >
            <Pill className={`h-4 w-4 mr-2 ${
              activeSupplement === id ? "text-indigo-200" : "text-indigo-500"
            }`} />
            <div className="truncate">
              <span className="font-medium">{supplementNames[id] || id}</span>
              {getConnections(id).length > 0 && (
                <Badge 
                  variant="outline" 
                  className={`ml-2 ${
                    activeSupplement === id 
                      ? "bg-indigo-700 text-white border-indigo-500" 
                      : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  }`}
                >
                  {getConnections(id).length}
                </Badge>
              )}
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
  
  // Affichage des suppléments pour mobile
  const renderSupplementsMobile = () => (
    <div className="p-4 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-min">
        {supplements.map((id, index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={activeSupplement === id ? "default" : "outline"}
              className={`h-auto py-2 px-3 whitespace-nowrap ${
                activeSupplement === id 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                  : "border-indigo-100 bg-white hover:bg-indigo-50"
              }`}
              onClick={() => handleSupplementClick(id)}
            >
              <div className="flex items-center">
                <Pill className={`h-3.5 w-3.5 mr-1.5 ${
                  activeSupplement === id ? "text-indigo-200" : "text-indigo-500"
                }`} />
                <span className="font-medium text-xs">{supplementNames[id] || id}</span>
                {getConnections(id).length > 0 && (
                  <Badge 
                    variant="outline" 
                    className={`ml-1.5 text-xs px-1.5 ${
                      activeSupplement === id 
                        ? "bg-indigo-700 text-white border-indigo-500" 
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}
                  >
                    {getConnections(id).length}
                  </Badge>
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
  
  // Détails des connexions pour le supplément actif
  const renderConnectionDetails = () => {
    if (!activeSupplement) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Network className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h4 className="text-base font-medium text-gray-700 mb-2">Sélectionnez un supplément</h4>
          <p className="text-sm max-w-md mx-auto">
            Cliquez sur un supplément pour voir ses interactions synergiques avec d'autres suppléments de votre protocole.
          </p>
        </div>
      );
    }
    
    const connections = getConnections(activeSupplement);
    
    if (connections.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Network className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h4 className="text-base font-medium text-gray-700 mb-2">Aucune synergie détectée</h4>
          <p className="text-sm max-w-md mx-auto">
            Ce supplément n'a pas d'interactions synergiques connues avec les autres suppléments de votre protocole.
          </p>
        </div>
      );
    }
    
    return (
      <div className="p-4">
        <div className="mb-3 pb-3 border-b border-gray-100">
          <h4 className="text-base font-medium text-indigo-800">
            Synergies avec {supplementNames[activeSupplement] || activeSupplement}
          </h4>
          <p className="text-xs text-gray-600">
            {connections.length} interaction{connections.length > 1 ? 's' : ''} synergique{connections.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="space-y-3">
          {connections.map((connection, index) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <div className="font-medium">{connection.name}</div>
                <Badge className={`
                  ${connection.effect < 1.2 ? 'bg-green-100 text-green-800 border-green-200' : 
                    connection.effect < 1.4 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                    'bg-red-100 text-red-800 border-red-200'}
                `}>
                  +{Math.round((connection.effect - 1) * 100)}%
                </Badge>
              </div>
              
              <div className="p-3">
                <div className="mb-2">
                  <p className="text-sm text-gray-700">{connection.mechanism}</p>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Évidence: {connection.evidenceLevel}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => handleSupplementClick(connection.id)}
                  >
                    Voir détails
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="border border-indigo-100 overflow-hidden">
      {renderHeader()}
      {renderOverallEffect()}
      
      <div className="flex flex-col md:flex-row">
        <div className={isMobile ? "w-full" : "w-1/3 border-r border-gray-100"}>
          {isMobile ? renderSupplementsMobile() : renderSupplementsDesktop()}
        </div>
        
        <div className={isMobile ? "w-full" : "w-2/3"}>
          {renderConnectionDetails()}
        </div>
      </div>
    </Card>
  );
}