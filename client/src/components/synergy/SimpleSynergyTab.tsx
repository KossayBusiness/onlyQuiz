import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const SimpleSynergyTab: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold mb-4">Synergies entre suppléments</h2>
      <p className="mb-6">Les combinaisons suivantes offrent des effets synergiques pour amplifier les bénéfices:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Magnésium + Vitamine B</h3>
          <p className="text-sm mb-3">Améliore l'énergie et réduit le stress</p>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            +15% d'efficacité combinée
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Action sur le système nerveux et la production d'énergie cellulaire.
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Ashwagandha + Rhodiola</h3>
          <p className="text-sm mb-3">Puissante combinaison adaptogène</p>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            +20% d'efficacité combinée
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Effets complémentaires sur différentes voies de gestion du stress.
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Probiotiques + Prébiotiques</h3>
          <p className="text-sm mb-3">Optimisation du microbiome intestinal</p>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            +25% d'efficacité combinée
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Les prébiotiques nourrissent et stimulent la croissance des probiotiques.
          </p>
        </Card>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Information scientifique
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Les synergies entre suppléments sont basées sur des études cliniques démontrant 
          comment certaines combinaisons amplifient mutuellement leurs effets ou comblent 
          leurs lacunes respectives.
        </p>
      </div>
    </div>
  );
};