import React from 'react';
import { Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
            <span>Made with</span>
            <Heart className="text-pink-500" size={16} />
            <span>and Rohit</span>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-4">
            <Link 
              to="https://github.com/rohitkumar-14/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-purple-500 transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
            </Link>
            <span>© {new Date().getFullYear()} KiddosTales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;