
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 w-full">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">À propos</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Notre histoire</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Notre équipe</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Actualités</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Logements</Link></li>
              <li><Link to="/emplois" className="text-gray-300 hover:text-white transition-colors">Emplois</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Formations</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Conseils</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Centre d'aide</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sholom-primary-lighter" />
                <span className="text-gray-300">+228 12345678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sholom-primary-lighter" />
                <a href="mailto:contact@shalomjobcenter.com" className="text-gray-300 hover:text-white transition-colors">contact@shalomjobcenter.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sholom-primary-lighter mt-1" />
                <span className="text-gray-300">123 Rue principale, Lomé, Togo</span>
              </li>
            </ul>
            
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Shalom Job Center. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Mentions légales</Link>
            <span className="text-gray-600">|</span>
            <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Cookies</Link>
            <span className="text-gray-600">|</span>
            <Link to="/faq" className="text-gray-400 text-sm hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
