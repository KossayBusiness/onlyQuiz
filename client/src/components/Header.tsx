import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
            <i className="fas fa-leaf text-xl"></i>
          </div>
          <h1 className="font-heading font-bold text-primary-600 text-xl md:text-2xl">FrenchNatural</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-neutral-600 hover:text-primary-600 transition">Accueil</Link></li>
            <li><Link href="/quiz" className="text-neutral-600 hover:text-primary-600 transition">Quiz</Link></li>
            <li><Link href="#" className="text-neutral-600 hover:text-primary-600 transition">Catalogue</Link></li>
            <li><Link href="#" className="text-neutral-600 hover:text-primary-600 transition">À propos</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
