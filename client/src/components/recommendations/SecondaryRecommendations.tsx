import React from 'react';
import { SupplementRecommendation } from '@/utils/types';

interface SecondaryRecommendationsProps {
  recommendations: SupplementRecommendation[];
}

const SecondaryRecommendations: React.FC<SecondaryRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="mb-8">
      <h3 className="font-heading font-semibold text-xl text-neutral-800 mb-4 flex items-center">
        <span className="mr-2 bg-secondary-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
        Recommandations complémentaires
      </h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        {recommendations.map((recommendation) => (
          <div 
            key={recommendation.supplementId}
            className="recommendation-card-sm bg-white rounded-lg shadow-sm overflow-hidden border-t-2 border-secondary-500"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-heading font-medium text-base text-neutral-800">{recommendation.name}</h4>
                <div className="bg-secondary-100 text-secondary-800 text-xs font-medium py-0.5 px-1.5 rounded">
                  {Math.round(recommendation.matchScore)}%
                </div>
              </div>
              
              <p className="text-xs text-neutral-600 mb-3 line-clamp-2">{recommendation.personalizedReason.split('.')[0]}.</p>
              
              <div className="space-y-1 mb-3">
                {recommendation.targetSymptoms.slice(0, 2).map((symptomId, index) => (
                  <div key={`symptom-${index}`} className="flex items-start">
                    <div className="flex-shrink-0 text-secondary-500 text-xs">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="ml-1.5 text-xs text-neutral-700">
                      {getSymptomLabel(symptomId)}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="w-full text-xs py-1.5 bg-white border border-secondary-500 hover:bg-secondary-50 text-secondary-700 rounded transition focus:outline-none focus:ring-1 focus:ring-secondary-500">
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fonction helper pour obtenir le libellé d'un symptôme
function getSymptomLabel(symptomId: string): string {
  const symptomMap: Record<string, string> = {
    'stress': 'Réduit le stress',
    'anxiety': 'Diminue l\'anxiété',
    'insomnia': 'Améliore le sommeil',
    'fatigue': 'Combat la fatigue',
    'digestive_issues': 'Soulage la digestion',
    'muscle_tension': 'Relaxe les muscles',
    'headache': 'Prévient les maux de tête',
    'joint_pain': 'Soulage les articulations',
    'brain_fog': 'Clarifie la pensée',
    'mood_swings': 'Stabilise l\'humeur'
  };
  
  return symptomMap[symptomId] || symptomId;
}

export default SecondaryRecommendations;
