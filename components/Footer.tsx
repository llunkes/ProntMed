
import React from 'react';
import AdBanner from './AdBanner';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12">
      <AdBanner width="100%" height={90} className="mx-auto" />
      <div className="bg-gray-800 text-white">
        <div className="max-w-screen-2xl mx-auto py-4 px-4 md:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ProntMed. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;