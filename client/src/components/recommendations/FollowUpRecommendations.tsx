import React from 'react';

interface FollowUpRecommendationsProps {
  recommendations: string[];
}

const FollowUpRecommendations: React.FC<FollowUpRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations.length) return null;
  
  return (
    <div className="mb-8">
      <h3 className="font-heading font-semibold text-xl text-neutral-800 mb-4">Suivi recommandé</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-5">
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div className="flex" key={index}>
              <div className="flex-shrink-0 text-primary-500 mt-0.5">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-700">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUpRecommendations;
