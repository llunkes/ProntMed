import React from 'react';
import AdBanner from './AdBanner';
import LogoIcon from './LogoIcon';

interface HeaderProps {
    user: { name: string };
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white w-full border-b border-gray-200 shadow-sm">
      <AdBanner width="100%" height={90} className="mx-auto" />
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <LogoIcon className="w-10 h-10 text-brand-blue" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              ProntMed
            </h1>
          </div>
          <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium hidden sm:block">Olá, {user.name}</span>
              <button
                  onClick={onLogout}
                  className="bg-brand-blue-light hover:bg-red-100 text-brand-blue-dark hover:text-brand-danger font-semibold py-2 px-4 border border-gray-300 hover:border-red-300 rounded-lg shadow-sm flex items-center space-x-2 transition-all duration-300"
              >
                  <span>Sair</span>
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;