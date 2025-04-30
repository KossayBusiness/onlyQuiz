import React from 'react';

interface SymptomAnalysisItem {
  severity: number;
  priority: number;
  relatedSymptoms: string[];
  potentialCauses: string[];
}

interface GoalAnalysisItem {
  importance: number;
  priority: number;
  timeFrame: string;
  recommendedApproach: string;
}

interface AnalysisSummaryProps {
  symptomAnalysis: Record<string, SymptomAnalysisItem>;
  goalAnalysis: Record<string, GoalAnalysisItem>;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ symptomAnalysis, goalAnalysis }) => {
  // Helper function to get symptom display name
  const getSymptomName = (symptomId: string): string => {
    const symptomMap: Record<string, string> = {
      'stress': 'Stress',
      'anxiety': 'Anxiété',
      'insomnia': 'Insomnie',
      'fatigue': 'Fatigue',
      'digestive_issues': 'Troubles digestifs',
      'headache': 'Maux de tête',
      'muscle_tension': 'Tensions musculaires',
      'joint_pain': 'Douleurs articulaires',
      'brain_fog': 'Brouillard mental',
      'mood_swings': 'Sautes d\'humeur'
    };
    
    return symptomMap[symptomId] || symptomId;
  };
  
  // Helper function to get goal display name
  const getGoalName = (goalId: string): string => {
    const goalMap: Record<string, string> = {
      'stress_management': 'Gestion du stress',
      'sleep_improvement': 'Amélioration du sommeil',
      'energy_enhancement': 'Plus d\'énergie',
      'immune_boost': 'Renforcement immunitaire',
      'cognitive_function': 'Amélioration de la concentration',
      'mood_stabilization': 'Stabilisation de l\'humeur',
      'digestive_health': 'Santé digestive',
      'hormonal_balance': 'Équilibre hormonal'
    };
    
    return goalMap[goalId] || goalId;
  };
  
  // Get priority label based on priority value
  const getPriorityLabel = (priority: number): { label: string; color: string } => {
    if (priority >= 80) return { label: 'Priorité élevée', color: 'primary' };
    if (priority >= 60) return { label: 'Priorité moyenne', color: 'primary' };
    return { label: 'Priorité standard', color: 'neutral' };
  };
  
  return (
    <div className="mb-8">
      <h3 className="font-heading font-semibold text-xl text-neutral-800 mb-4">Résumé de l'analyse</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-5">
          {/* Analyse des symptômes */}
          {Object.keys(symptomAnalysis).length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-base text-neutral-800 mb-3">Analyse des symptômes</h4>
              <div className="space-y-3">
                {Object.entries(symptomAnalysis)
                  .sort((a, b) => b[1].priority - a[1].priority)
                  .slice(0, 4)
                  .map(([symptomId, data]) => {
                    const priorityInfo = getPriorityLabel(data.priority);
                    
                    return (
                      <div className="bg-neutral-50 p-3 rounded" key={symptomId}>
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-medium text-sm">{getSymptomName(symptomId)}</h5>
                          <div className="flex items-center">
                            <span className="text-xs text-neutral-500 mr-2">Sévérité: {data.severity}/10</span>
                            <span className={`text-xs bg-${priorityInfo.color}-100 text-${priorityInfo.color}-800 px-2 py-0.5 rounded`}>
                              {priorityInfo.label}
                            </span>
                          </div>
                        </div>
                        
                        {data.relatedSymptoms.length > 0 && (
                          <p className="text-xs text-neutral-600 mb-1">
                            Potentiellement lié à: {data.relatedSymptoms.map(id => getSymptomName(id)).join(', ')}
                          </p>
                        )}
                        
                        {data.potentialCauses.length > 0 && (
                          <p className="text-xs text-neutral-600">
                            Causes possibles: {data.potentialCauses.join(', ')}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          
          {/* Analyse des objectifs */}
          {Object.keys(goalAnalysis).length > 0 && (
            <div>
              <h4 className="font-medium text-base text-neutral-800 mb-3">Analyse des objectifs</h4>
              <div className="space-y-3">
                {Object.entries(goalAnalysis)
                  .sort((a, b) => b[1].priority - a[1].priority)
                  .slice(0, 3)
                  .map(([goalId, data]) => {
                    const priorityInfo = getPriorityLabel(data.priority);
                    
                    return (
                      <div className="bg-neutral-50 p-3 rounded" key={goalId}>
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-medium text-sm">{getGoalName(goalId)}</h5>
                          <div className="flex items-center">
                            <span className="text-xs text-neutral-500 mr-2">Importance: {data.importance}/10</span>
                            <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-0.5 rounded">
                              {data.priority >= 70 ? 'Objectif prioritaire' : 'Objectif secondaire'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-neutral-600 mb-1">
                          Temporalité: {data.timeFrame} pour des résultats significatifs
                        </p>
                        
                        <p className="text-xs text-neutral-600">
                          Approche recommandée: {data.recommendedApproach}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;
