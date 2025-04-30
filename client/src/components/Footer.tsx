import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-500 mr-3">
                <i className="fas fa-leaf text-xl"></i>
              </div>
              <h2 className="font-heading font-bold text-xl">FrenchNatural</h2>
            </div>
            <p className="text-neutral-300 text-sm">Solutions naturelles personnalisées pour votre bien-être, basées sur la science et adaptées à vos besoins uniques.</p>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/" className="hover:text-white transition">Accueil</Link></li>
              <li><Link href="/quiz" className="hover:text-white transition">Quiz Santé</Link></li>
              <li><Link href="#" className="hover:text-white transition">Catalogue</Link></li>
              <li><Link href="#" className="hover:text-white transition">Base de connaissances</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition">Guides</Link></li>
              <li><Link href="#" className="hover:text-white transition">Études scientifiques</Link></li>
              <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="mailto:contact@frenchnatural.com" className="hover:text-white transition">contact@frenchnatural.com</a></li>
              <li>Du lundi au vendredi, 9h-18h</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className="text-neutral-300 hover:text-white transition"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-neutral-300 hover:text-white transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-neutral-300 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-neutral-300 hover:text-white transition"><i className="fab fa-linkedin"></i></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} FrenchNatural. Tous droits réservés.</p>
          <p className="mt-2">
            <Link href="#" className="hover:text-white transition">Conditions d'utilisation</Link> | 
            <Link href="#" className="hover:text-white transition"> Politique de confidentialité</Link> | 
            <Link href="#" className="hover:text-white transition"> Mentions légales</Link>
          </p>
          <p className="mt-2 text-xs">Les informations fournies ne remplacent pas l'avis d'un professionnel de santé.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
