import React from 'react';
import { RecommendationResult } from '@/utils/types';
import PrimaryRecommendations from './PrimaryRecommendations';
import SecondaryRecommendations from './SecondaryRecommendations';
import LifestyleRecommendations from './LifestyleRecommendations';
import DietaryRecommendations from './DietaryRecommendations';
import AnalysisSummary from './AnalysisSummary';
import FollowUpRecommendations from './FollowUpRecommendations';

interface RecommendationsDisplayProps {
  isLoading: boolean;
  recommendations: RecommendationResult | null;
}

const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({ isLoading, recommendations }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="font-heading font-bold text-2xl text-neutral-800 mb-6">Vos recommandations personnalisées</h2>
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-neutral-600">Analyse de vos données et génération des recommandations personnalisées...</p>
        </div>
      )}
      
      {/* Résultats */}
      {!isLoading && recommendations && (
        <div>
          {/* Recommandations primaires */}
          {recommendations.primaryRecommendations.length > 0 && (
            <PrimaryRecommendations recommendations={recommendations.primaryRecommendations} />
          )}
          
          {/* Recommandations secondaires */}
          {recommendations.secondaryRecommendations.length > 0 && (
            <SecondaryRecommendations recommendations={recommendations.secondaryRecommendations} />
          )}
          
          {/* Recommandations de mode de vie */}
          {recommendations.lifestyleRecommendations.length > 0 && (
            <LifestyleRecommendations recommendations={recommendations.lifestyleRecommendations} />
          )}
          
          {/* Recommandations alimentaires */}
          {recommendations.dietaryRecommendations.length > 0 && (
            <DietaryRecommendations recommendations={recommendations.dietaryRecommendations} />
          )}
          
          {/* Résumé de l'analyse */}
          <AnalysisSummary 
            symptomAnalysis={recommendations.symptomAnalysis} 
            goalAnalysis={recommendations.goalAnalysis} 
          />
          
          {/* Recommandations de suivi */}
          {recommendations.followUpRecommendations.length > 0 && (
            <FollowUpRecommendations recommendations={recommendations.followUpRecommendations} />
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationsDisplay;
