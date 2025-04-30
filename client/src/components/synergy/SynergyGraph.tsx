import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pill, ArrowUpRight, TrendingUp, BadgePercent, Award } from 'lucide-react';

interface Supplement {
  id: string;
  name: string;
  description: string;
  efficacy?: number;
}

interface SynergyConnection {
  source: string;
  target: string;
  strength: number;
  description: string;
  scientificBasis?: string;
}

interface SynergyGraphProps {
  supplements: Supplement[];
  connections: SynergyConnection[];
}

/**
 * SynergyGraph - Composant visuel montrant les synergies entre suppléments
 * 
 * Affiche une représentation visuelle des interactions entre suppléments
 * avec des connexions plus épaisses pour les synergies plus fortes
 */
export const SynergyGraph: React.FC<SynergyGraphProps> = ({ supplements, connections }) => {
  // Générer les positions pour un graphe circulaire
  const nodePositions = useMemo(() => {
    const radius = 120; // rayon du cercle
    const positions: { [key: string]: { x: number, y: number } } = {};
    
    supplements.forEach((supplement, index) => {
      const angle = (index / supplements.length) * 2 * Math.PI;
      positions[supplement.id] = {
        x: radius * Math.cos(angle) + radius,
        y: radius * Math.sin(angle) + radius,
      };
    });
    
    return positions;
  }, [supplements]);
  
  // Filtre pour ne montrer que les connexions significatives
  const significantConnections = connections.filter(conn => conn.strength > 0.3);
  
  return (
    <div className="w-full max-w-full overflow-hidden">
      <h3 className="text-xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Interactions Synergiques
      </h3>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md overflow-x-auto">
        <svg 
          width="100%" 
          height={300} 
          viewBox="0 0 500 300" 
          className="mx-auto"
        >
          {/* Connexions entre suppléments */}
          {significantConnections.map((connection, i) => {
            const source = nodePositions[connection.source];
            const target = nodePositions[connection.target];
            
            if (!source || !target) return null;
            
            // Déterminer la couleur en fonction de la force de connexion
            const strokeColor = 
              connection.strength > 0.7 ? 'rgba(139, 92, 246, 0.8)' : // violet
              connection.strength > 0.5 ? 'rgba(79, 70, 229, 0.7)' : // indigo
              'rgba(99, 102, 241, 0.5)'; // bleu-indigo léger
            
            // Épaisseur proportionnelle à la force
            const strokeWidth = connection.strength * 4;
            
            return (
              <g key={`connection-${i}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={connection.strength > 0.6 ? "none" : "5,5"}
                />
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2 - 8}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="10"
                  className="font-medium"
                >
                  +{Math.round(connection.strength * 100)}%
                </text>
              </g>
            );
          })}
          
          {/* Nœuds des suppléments */}
          {supplements.map((supplement, i) => {
            const position = nodePositions[supplement.id];
            
            if (!position) return null;
            
            return (
              <g key={`node-${i}`}>
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { delay: i * 0.1, duration: 0.3 }
                  }}
                  cx={position.x}
                  cy={position.y}
                  r={20}
                  fill="url(#gradient)"
                  className="cursor-pointer"
                />
                <text
                  x={position.x}
                  y={position.y + 35}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {supplement.name}
                </text>
                {supplement.efficacy && (
                  <text
                    x={position.x}
                    y={position.y + 50}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="10"
                  >
                    ({Math.round(supplement.efficacy * 100)}% efficacité)
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Dégradé pour les cercles */}
          <defs>
            <radialGradient id="gradient">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {significantConnections.map((connection, i) => (
          <motion.div
            key={`detail-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: i * 0.1, duration: 0.3 }
            }}
            className="p-3 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <h4 className="font-semibold text-sm">
                {supplements.find(s => s.id === connection.source)?.name || connection.source} 
                {' + '} 
                {supplements.find(s => s.id === connection.target)?.name || connection.target}
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{connection.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-indigo-600 dark:text-indigo-400">
              <Award className="h-3 w-3" />
              <span>{connection.scientificBasis || "Corrélation clinique établie"}</span>
            </div>
            <div className="flex justify-end">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <BadgePercent className="h-3 w-3" /> 
                Synergie +{Math.round(connection.strength * 100)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};