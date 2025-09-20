import React from 'react';
import { XIcon, SparklesIcon } from './icons';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  docName: string;
  summary: string;
  isLoading: boolean;
  error: string;
}

// A simple component to render basic markdown to styled HTML using prose.
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const renderWithBreaks = (text: string) => {
    return text.split('**').map((part, index) => 
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };
  
  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    if (line.trim().startsWith('- ')) {
      currentList.push(line.trim().substring(2).trim());
    } else {
      if (currentList.length > 0) {
        blocks.push(
          <ul key={`ul-${index}`} className="list-disc pl-5 space-y-1">
            {currentList.map((item, itemIndex) => (
              <li key={itemIndex}>{renderWithBreaks(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
      
      if (line.trim().startsWith('## ')) {
        blocks.push(<h2 key={index} className="text-xl font-bold mt-4 mb-2">{renderWithBreaks(line.substring(3).trim())}</h2>);
      } else if (line.trim().startsWith('# ')) {
         blocks.push(<h1 key={index} className="text-2xl font-bold mt-4 mb-2">{renderWithBreaks(line.substring(2).trim())}</h1>);
      } else if (line.trim().length > 0) {
        blocks.push(<p key={index}>{renderWithBreaks(line)}</p>);
      }
    }
  });

  if (currentList.length > 0) {
    blocks.push(
      <ul key="ul-last" className="list-disc pl-5 space-y-1">
        {currentList.map((item, itemIndex) => (
          <li key={itemIndex}>{renderWithBreaks(item)}</li>
        ))}
      </ul>
    );
  }

  return <>{blocks}</>;
};


const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, docName, summary, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-modal-title">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative transform transition-all flex flex-col" style={{maxHeight: '80vh'}}>
         <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-6 h-6 text-brand-blue" />
              <h2 id="summary-modal-title" className="text-2xl font-bold truncate">Resumo IA: {docName}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
         </div>
        <div className="p-6 flex-grow overflow-y-auto">
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue"></div>
                    <p className="mt-4 text-lg text-brand-gray font-semibold">Analisando documento...</p>
                    <p className="text-sm text-brand-gray">Isso pode levar alguns segundos.</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="py-1">
                            <p className="text-sm text-red-700 font-semibold">Ocorreu um erro</p>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            {!isLoading && summary && (
                <div className="prose prose-blue max-w-none">
                   <MarkdownRenderer content={summary} />
                </div>
            )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex-shrink-0 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;