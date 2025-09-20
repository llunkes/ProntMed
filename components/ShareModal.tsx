
import React, { useState } from 'react';
import { XIcon, ShareIcon } from './icons';

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://meuprontuario.digital/share/${crypto.randomUUID()}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center text-center">
            <div className="bg-brand-blue-light p-4 rounded-full mb-4">
                <ShareIcon className="w-8 h-8 text-brand-blue" />
            </div>
          <h2 className="text-2xl font-bold mb-2">Compartilhar Histórico</h2>
          <p className="text-brand-gray mb-6">
            Copie o link seguro abaixo para compartilhar uma versão somente leitura do seu histórico médico com familiares ou profissionais de saúde.
          </p>
          <div className="w-full flex items-center space-x-2 bg-gray-100 border border-gray-300 rounded-md p-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="bg-transparent border-none text-sm text-gray-700 w-full focus:ring-0"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue rounded-md hover:bg-blue-700 transition-colors"
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
