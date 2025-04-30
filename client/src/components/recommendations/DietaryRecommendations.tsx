import React from 'react';

interface DietaryRecommendationsProps {
  recommendations: string[];
}

const DietaryRecommendations: React.FC<DietaryRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations.length) return null;
  
  return (
    <div className="mb-8">
      <h3 className="font-heading font-semibold text-xl text-neutral-800 mb-4 flex items-center">
        <span className="mr-2 bg-neutral-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
        Recommandations alimentaires
      </h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-5">
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => {
            // Extraction du titre (première phrase) et du contenu (reste)
            const parts = recommendation.split(':');
            const title = parts.length > 1 ? parts[0] : 'Recommandation alimentaire';
            const content = parts.length > 1 ? parts.slice(1).join(':').trim() : recommendation;
            
            return (
              <div className="flex" key={index}>
                <div className="flex-shrink-0 text-neutral-700 mt-0.5">
                  <i className="fas fa-utensils"></i>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-base text-neutral-800">{title}</h4>
                  <p className="text-sm text-neutral-600">{content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DietaryRecommendations;
