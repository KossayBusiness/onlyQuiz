import React from 'react';
import { SupplementRecommendation } from '@/utils/types';

interface PrimaryRecommendationsProps {
  recommendations: SupplementRecommendation[];
}

const PrimaryRecommendations: React.FC<PrimaryRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="mb-8">
      <h3 className="font-heading font-semibold text-xl text-neutral-800 mb-4 flex items-center">
        <span className="mr-2 bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
        Recommandations principales
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => (
          <div 
            key={recommendation.supplementId}
            className="recommendation-card bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-primary-500"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-heading font-semibold text-lg text-neutral-800">{recommendation.name}</h4>
                <div className="bg-primary-100 text-primary-800 text-xs font-medium py-1 px-2 rounded">
                  Score: {Math.round(recommendation.matchScore * 100) / 100}%
                </div>
              </div>
              
              <p className="text-sm text-neutral-600 mb-4">{recommendation.personalizedReason}</p>
              
              <div className="mb-4">
                <div className="text-xs font-medium text-neutral-500 mb-1">Efficacité estimée</div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full" 
                    style={{ width: `${recommendation.efficacyPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{recommendation.efficacyPercentage}% d'efficacité</span>
                  <span>{recommendation.timeFrame}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {recommendation.targetSymptoms.map((symptomId, index) => (
                  <div key={`symptom-${index}`} className="flex items-start">
                    <div className="flex-shrink-0 text-primary-500">
                      <i className="fas fa-check-circle mt-0.5"></i>
                    </div>
                    <p className="ml-2 text-sm text-neutral-700">
                      {getSymptomLabel(symptomId)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="text-xs font-medium text-neutral-500 mb-1">Dosage recommandé</div>
              <p className="text-sm text-neutral-700 mb-4">{recommendation.dosage}</p>
              
              <button className="w-full mt-2 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center">
                <i className="fas fa-info-circle mr-2"></i> Voir détails complets
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
    'stress': 'Réduit significativement les niveaux de stress',
    'anxiety': 'Diminue l\'anxiété',
    'insomnia': 'Améliore la qualité du sommeil',
    'fatigue': 'Combat la fatigue',
    'digestive_issues': 'Soulage les troubles digestifs',
    'muscle_tension': 'Relaxe les tensions musculaires',
    'headache': 'Aide à prévenir les maux de tête',
    'joint_pain': 'Soulage les douleurs articulaires',
    'brain_fog': 'Clarifie le brouillard mental',
    'mood_swings': 'Stabilise l\'humeur'
  };
  
  return symptomMap[symptomId] || `Cible ${symptomId}`;
}

export default PrimaryRecommendations;
