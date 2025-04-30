/**
 * Composant de visualisation interactive des synergies entre suppléments
 * avec détection adaptative pour mobile et desktop
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, InfoIcon, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { SynergyCategory } from '@/utils/synergyTypes';

// Types spécifiques pour le graphe
interface Node {
  id: string;
  name: string;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  category?: SynergyCategory;
  highlighted?: boolean;
}

interface Link {
  source: string | Node;
  target: string | Node;
  strength: number;
  category: SynergyCategory;
  mechanism?: string;
}

interface SynergyData {
  synergyPairs: Array<{
    pair: [string, string];
    effect: number;
    mechanism: string;
    evidenceLevel: string;
    category?: SynergyCategory;
  }>;
  effectivenessMultiplier: number;
  keySupplements?: string[];
}

interface InteractiveSynergyGraphProps {
  supplements: string[];
  supplementNames: Record<string, string>;
  synergyData: SynergyData;
  width?: number;
  height?: number;
}

export function InteractiveSynergyGraph({
  supplements,
  supplementNames,
  synergyData,
  width: propWidth = 500,
  height: propHeight = 400
}: InteractiveSynergyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredLink, setHoveredLink] = useState<Link | null>(null);
  const [width, setWidth] = useState(propWidth);
  const [height, setHeight] = useState(propHeight);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [autoRunning, setAutoRunning] = useState(true);
  
  // Détecter l'appareil et définir la taille de visualisation optimale
  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      // Responsively adjust graph dimensions
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.min(containerWidth - 20, isMobileDevice ? 350 : 600);
        const newHeight = isMobileDevice ? 300 : 400;
        
        setWidth(newWidth);
        setHeight(newHeight);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [propWidth, propHeight]);
  
  // Initialiser le graphe
  useEffect(() => {
    // Si moins de 2 suppléments, pas de graphe à afficher
    if (supplements.length < 2) {
      setNodes([]);
      setLinks([]);
      return;
    }
    
    // Créer les nœuds (suppléments)
    const newNodes: Node[] = supplements.map((id, index) => {
      // Position initiale en cercle
      const angle = (index / supplements.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      
      return {
        id,
        name: supplementNames[id] || id,
        radius: 20,  // Taille du nœud
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
        vx: 0,
        vy: 0
      };
    });
    
    // Créer les liens (synergies)
    const newLinks: Link[] = synergyData.synergyPairs.map(pair => ({
      source: pair.pair[0],
      target: pair.pair[1],
      strength: pair.effect,
      category: pair.category || 'complementary', // Catégorie par défaut
      mechanism: pair.mechanism
    }));
    
    setNodes(newNodes);
    setLinks(newLinks);
    
    // Démarrer la simulation
    startSimulation(newNodes, newLinks);
  }, [supplements, supplementNames, synergyData, width, height]);
  
  // Simulation de forces pour le graphe
  const startSimulation = (initialNodes: Node[], initialLinks: Link[]) => {
    let animationFrameId: number;
    
    const nodeMap = new Map<string, Node>();
    initialNodes.forEach(node => nodeMap.set(node.id, node));
    
    // Résoudre les références des liens
    const resolvedLinks = initialLinks.map(link => ({
      ...link,
      source: typeof link.source === 'string' ? nodeMap.get(link.source) || link.source : link.source,
      target: typeof link.target === 'string' ? nodeMap.get(link.target) || link.target : link.target
    }));
    
    // Simulation physique
    const simulationStep = () => {
      // Calculer les forces
      // Force de répulsion entre tous les nœuds
      for (let i = 0; i < initialNodes.length; i++) {
        for (let j = i + 1; j < initialNodes.length; j++) {
          const nodeA = initialNodes[i];
          const nodeB = initialNodes[j];
          
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance === 0) continue;
          
          const repulsionForce = 1000 / (distance * distance); // Répulsion inverse au carré
          
          const fx = dx / distance * repulsionForce;
          const fy = dy / distance * repulsionForce;
          
          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }
      
      // Force d'attraction entre les nœuds liés
      resolvedLinks.forEach(link => {
        if (typeof link.source === 'string' || typeof link.target === 'string') return;
        
        const sourceNode = link.source as Node;
        const targetNode = link.target as Node;
        
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        // L'attraction est plus forte pour les liens à forte synergie
        const attractionStrength = 0.05 * (link.strength ** 2);
        
        const fx = dx * attractionStrength;
        const fy = dy * attractionStrength;
        
        sourceNode.vx += fx;
        sourceNode.vy += fy;
        targetNode.vx -= fx;
        targetNode.vy -= fy;
      });
      
      // Appliquer les forces et la friction
      initialNodes.forEach(node => {
        // Friction pour stabiliser le système
        node.vx *= 0.9;
        node.vy *= 0.9;
        
        // Appliquer les vélocités
        node.x += node.vx;
        node.y += node.vy;
        
        // Confiner dans les limites
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });
      
      // Mettre à jour l'état
      setNodes([...initialNodes]);
      setLinks([...resolvedLinks]);
      
      // Continuer l'animation
      if (autoRunning) {
        animationFrameId = requestAnimationFrame(simulationStep);
      }
    };
    
    simulationStep();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  };
  
  // Dessiner le graphe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);
    
    // Appliquer le zoom
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate((width * (1 - zoom)) / (2 * zoom), (height * (1 - zoom)) / (2 * zoom));
    
    // Dessiner les liens
    links.forEach(link => {
      if (typeof link.source === 'string' || typeof link.target === 'string') return;
      
      const source = link.source as Node;
      const target = link.target as Node;
      
      // Déterminer l'épaisseur et la couleur du lien
      const baseWidth = 2;
      const effectStrength = link.strength - 1;
      const lineWidth = baseWidth + (effectStrength * 4);
      
      // Obtenir la couleur en fonction de la catégorie
      let strokeColor = getCategoryColor(link.category, 0.7);
      
      if (hoveredLink === link) {
        strokeColor = getCategoryColor(link.category, 1);
      } else if (selectedNode && (source.id === selectedNode.id || target.id === selectedNode.id)) {
        // Mettre en évidence les liens du nœud sélectionné
        strokeColor = getCategoryColor(link.category, 0.9);
      } else if (selectedNode) {
        // Atténuer les liens non liés au nœud sélectionné
        strokeColor = getCategoryColor(link.category, 0.2);
      }
      
      // Dessiner le lien
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Ajouter une indication visuelle de la force
      if (effectStrength > 0.2) {
        // Calculer le point milieu
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        
        // Dessiner un cercle dont la taille indique la force de l'effet
        const glowRadius = 4 + (effectStrength * 10);
        const gradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, glowRadius);
        gradient.addColorStop(0, strokeColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(midX, midY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Dessiner les nœuds
    nodes.forEach(node => {
      // Déterminer le style du nœud
      let fillColor = '#4338ca'; // Couleur par défaut
      let strokeColor = '#c7d2fe';
      let lineWidth = 2;
      
      if (node === selectedNode) {
        // Nœud sélectionné
        fillColor = '#6366f1';
        strokeColor = '#e0e7ff';
        lineWidth = 3;
      } else if (selectedNode) {
        // Nœuds liés au nœud sélectionné
        const isConnected = links.some(link => {
          if (typeof link.source === 'string' || typeof link.target === 'string') return false;
          return (
            (link.source.id === selectedNode.id && link.target.id === node.id) ||
            (link.source.id === node.id && link.target.id === selectedNode.id)
          );
        });
        
        if (isConnected) {
          fillColor = '#6366f1'; // Couleur des nœuds connectés
        } else {
          fillColor = '#9ca3af'; // Nœuds non connectés (grisés)
        }
      }
      
      // Dessiner le cercle du nœud
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Ajouter un texte pour l'identifiant du nœud
      ctx.fillStyle = '#ffffff';
      ctx.font = isMobile ? '10px sans-serif' : '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Texte abrégé pour mobile
      const displayText = isMobile
        ? node.name.substring(0, 3)
        : node.name.length > 10 ? node.name.substring(0, 10) + '...' : node.name;
      
      ctx.fillText(displayText, node.x, node.y);
    });
    
    ctx.restore();
    
    // Ajouter un gestionnaire de clic sur le canvas
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / zoom;
      const y = (event.clientY - rect.top) / zoom;
      
      // Trouver le nœud cliqué
      let clickedNode = null;
      for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= node.radius) {
          clickedNode = node;
          break;
        }
      }
      
      // Trouver le lien cliqué
      let clickedLink = null;
      if (!clickedNode) {
        for (const link of links) {
          if (typeof link.source === 'string' || typeof link.target === 'string') continue;
          
          const source = link.source as Node;
          const target = link.target as Node;
          
          // Calculer la distance du point au segment
          const distanceToLink = distanceToSegment(x, y, source.x, source.y, target.x, target.y);
          
          if (distanceToLink < 10) {
            clickedLink = link;
            break;
          }
        }
        
        // Si clic sur un lien, afficher les infos
        if (clickedLink) {
          setHoveredLink(clickedLink);
        } else {
          setHoveredLink(null);
        }
      }
      
      setSelectedNode(clickedNode);
    };
    
    canvas.addEventListener('click', handleCanvasClick);
    
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [nodes, links, selectedNode, hoveredLink, width, height, zoom, isMobile]);
  
  // Calcul de la distance d'un point à un segment
  const distanceToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    
    if (len_sq !== 0) {
      param = dot / len_sq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Gérer le zoom
  const handleZoomIn = () => {
    setZoom(Math.min(2, zoom + 0.1));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(0.5, zoom - 0.1));
  };
  
  const handleReset = () => {
    setZoom(1);
    setSelectedNode(null);
    setHoveredLink(null);
  };
  
  // Obtenir une couleur en fonction de la catégorie
  const getCategoryColor = (category: SynergyCategory, alpha: number = 1) => {
    const categoryColors: Record<SynergyCategory, string> = {
      absorption: `rgba(249, 115, 22, ${alpha})`,     // Orange
      efficacy: `rgba(99, 102, 241, ${alpha})`,       // Indigo
      metabolism: `rgba(16, 185, 129, ${alpha})`,     // Emerald
      protection: `rgba(236, 72, 153, ${alpha})`,     // Pink
      complementary: `rgba(139, 92, 246, ${alpha})`   // Purple
    };
    
    return categoryColors[category] || `rgba(156, 163, 175, ${alpha})`;
  };
  
  // Obtenez le nom lisible d'une catégorie
  const getCategoryName = (category: SynergyCategory) => {
    const categoryNames: Record<SynergyCategory, string> = {
      absorption: "Optimisation de l'absorption",
      efficacy: "Amplification de l'efficacité",
      metabolism: "Optimisation métabolique",
      protection: "Protection biologique",
      complementary: "Effets complémentaires"
    };
    
    return categoryNames[category] || category;
  };
  
  // Info panel for selected node or hovered link
  const renderInfoPanel = () => {
    if (selectedNode) {
      // Trouver les connexions pour le nœud sélectionné
      const connections = links
        .filter(link => {
          if (typeof link.source === 'string' || typeof link.target === 'string') return false;
          return link.source.id === selectedNode.id || link.target.id === selectedNode.id;
        })
        .map(link => {
          if (typeof link.source === 'string' || typeof link.target === 'string') return null;
          
          const otherNode = link.source.id === selectedNode.id ? link.target : link.source;
          if (typeof otherNode === 'string') return null;
          
          return {
            id: otherNode.id,
            name: otherNode.name,
            strength: link.strength,
            category: link.category,
            mechanism: link.mechanism
          };
        })
        .filter(Boolean);
      
      if (isMobile) {
        // Version simplifiée pour mobile
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-white border border-indigo-100 rounded-lg shadow-sm text-xs"
          >
            <h4 className="font-medium text-indigo-800 mb-1">
              {selectedNode.name}
            </h4>
            <p className="text-gray-600 mb-2">
              {connections.length} interaction{connections.length !== 1 ? 's' : ''}
            </p>
            
            {connections.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {connections.map((conn: any) => (
                  <Badge 
                    key={conn.id}
                    className="text-[0.65rem] bg-indigo-50 text-indigo-700"
                  >
                    {conn.name} +{Math.round((conn.strength - 1) * 100)}%
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        );
      }
      
      // Version desktop
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white border border-indigo-100 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-indigo-800">
              {selectedNode.name}
            </h4>
            <Badge className="bg-indigo-100 text-indigo-800">
              {connections.length} interaction{connections.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {connections.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {connections.map((conn: any) => (
                <div 
                  key={conn.id} 
                  className="p-2 border border-gray-100 rounded bg-gray-50 text-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{conn.name}</span>
                    <Badge 
                      className={`${
                        conn.strength < 1.2 ? 'bg-green-100 text-green-800' : 
                        conn.strength < 1.4 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      +{Math.round((conn.strength - 1) * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{conn.mechanism || 'Interaction synergique'}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    Type: {getCategoryName(conn.category)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune interaction synergique détectée avec les autres suppléments.
            </p>
          )}
        </motion.div>
      );
    }
    
    if (hoveredLink && typeof hoveredLink.source !== 'string' && typeof hoveredLink.target !== 'string') {
      const sourceNode = hoveredLink.source as Node;
      const targetNode = hoveredLink.target as Node;
      
      // Version mobile ou desktop pour les liens
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 p-3 bg-white border rounded-lg shadow-sm ${isMobile ? 'text-xs' : 'text-sm'}`}
          style={{ borderColor: getCategoryColor(hoveredLink.category, 0.5) }}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">
              {sourceNode.name} + {targetNode.name}
            </h4>
            <Badge 
              className={`${
                hoveredLink.strength < 1.2 ? 'bg-green-100 text-green-800' : 
                hoveredLink.strength < 1.4 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}
            >
              +{Math.round((hoveredLink.strength - 1) * 100)}%
            </Badge>
          </div>
          
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-1`}>
            {hoveredLink.mechanism || 'Interaction synergique entre ces suppléments'}
          </p>
          
          <div className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-1.5" 
              style={{ backgroundColor: getCategoryColor(hoveredLink.category) }}
            ></div>
            <span className={`${isMobile ? 'text-[0.65rem]' : 'text-xs'} text-gray-500`}>
              {getCategoryName(hoveredLink.category)}
            </span>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };
  
  // Afficher une légende pour les catégories
  const renderLegend = () => {
    if (isMobile) return null; // Ne pas afficher la légende sur mobile pour économiser l'espace
    
    const categories: SynergyCategory[] = ['absorption', 'efficacy', 'metabolism', 'protection', 'complementary'];
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {categories.map(category => (
          <div key={category} className="flex items-center text-xs">
            <div 
              className="w-2.5 h-2.5 rounded-full mr-1" 
              style={{ backgroundColor: getCategoryColor(category) }}
            ></div>
            <span>{getCategoryName(category)}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      {/* Contrôles */}
      <div className="flex justify-center gap-2 mb-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoomer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dézoomer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Réinitialiser</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={autoRunning ? "default" : "outline"}
                size="sm" 
                className="h-8 px-2"
                onClick={() => setAutoRunning(!autoRunning)}
              >
                {autoRunning ? "Pause" : "Animer"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {autoRunning ? "Mettre en pause l'animation" : "Animer le graphe"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Canvas pour le graphe */}
      <div className="relative">
        {supplements.length < 2 ? (
          <div 
            className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg"
            style={{ width, height }}
          >
            <Network className="h-10 w-10 text-gray-300 mb-2" />
            <h4 className="text-gray-600 mb-1">Pas assez de suppléments</h4>
            <p className="text-sm text-gray-500">
              Sélectionnez au moins deux suppléments pour visualiser leurs synergies.
            </p>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={width} 
            height={height}
            className="border border-gray-200 rounded-lg bg-gradient-to-b from-gray-50 to-white"
          />
        )}
      </div>
      
      {/* Légende */}
      {renderLegend()}
      
      {/* Panneau d'information pour le nœud sélectionné ou le lien survolé */}
      {renderInfoPanel()}
    </div>
  );
}