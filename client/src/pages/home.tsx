import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">
          Quiz Nutritionnel Personnalisé
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Découvrez des recommandations de compléments alimentaires naturels basées sur vos besoins spécifiques
        </p>
        <Link href="/quiz">
          <Button className="bg-black hover:bg-gray-800 text-white py-6 px-8 rounded-lg text-lg">
            Commencer le quiz
          </Button>
        </Link>
      </div>
      
      {/* Comment ça marche */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Comment ça marche</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Répondez au quiz</h3>
              <p className="text-gray-600 text-sm">
                Cochez vos symptômes et précisez vos objectifs de santé en quelques clics
              </p>
            </div>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Analyse instantanée</h3>
              <p className="text-gray-600 text-sm">
                Notre système analyse votre profil et identifie les solutions adaptées à vos besoins
              </p>
            </div>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Recommandations</h3>
              <p className="text-gray-600 text-sm">
                Recevez des conseils personnalisés de compléments, nutrition et mode de vie
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Aperçu du quiz */}
      <Card className="mb-12 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Aperçu du quiz</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-800">Sélectionnez vos symptômes :</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Fatigue', 'Stress', 'Troubles du sommeil', 'Problèmes digestifs'].map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2 border rounded p-2">
                    <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                    </div>
                    <span className="text-sm">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-gray-800">Vos objectifs :</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Plus d\'énergie', 'Meilleur sommeil', 'Réduire le stress', 'Soutenir l\'immunité'].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2 border rounded p-2">
                    <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                    </div>
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* CTA */}
      <div className="text-center bg-emerald-50 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-emerald-800">
          Prêt à recevoir des recommandations adaptées à vos besoins ?
        </h2>
        <p className="text-gray-600 mb-6">
          Le quiz prend moins de 2 minutes et vous guide étape par étape
        </p>
        <Link href="/quiz">
          <Button className="bg-black hover:bg-gray-800 text-white py-6 px-8 rounded-lg text-lg">
            Commencer le quiz
          </Button>
        </Link>
      </div>
      
      {/* Badge d'infos */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span className="font-medium">2% Taux d'efficacité</span>
          <span className="text-amber-600">ⓘ</span>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span className="font-medium">8 Participants</span>
          <span className="text-blue-600">ⓘ</span>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span className="font-medium">3 Études analysées</span>
          <span className="text-green-600">ⓘ</span>
        </div>
      </div>
    </div>
  );
}
