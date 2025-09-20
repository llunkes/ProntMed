import React, { useState } from 'react';
import { MedicalDocument } from '../types';
import { DocumentTextIcon, TrashIcon, SparklesIcon } from './icons';
import { GoogleGenAI } from "@google/genai";
import SummaryModal from './SummaryModal';

// This function should be outside the component or memoized to avoid re-creation on every render.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};


interface DocumentListProps {
  documents: MedicalDocument[];
  onDeleteRequest: (docId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDeleteRequest }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        docName: string;
        summary: string;
        isLoading: boolean;
        error: string;
    }>({
        isOpen: false,
        docName: '',
        summary: '',
        isLoading: false,
        error: '',
    });

    const handleSummarize = async (doc: MedicalDocument) => {
        if (!doc.type.startsWith('image/')) {
            setModalState({
                isOpen: true,
                docName: doc.name,
                summary: '',
                isLoading: false,
                error: 'Tipo de arquivo não suportado. A sumarização com IA utiliza análise visual e funciona apenas com arquivos de imagem (JPG, PNG).',
            });
            return;
        }

        setModalState({ isOpen: true, docName: doc.name, summary: '', isLoading: true, error: '' });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = await fileToGenerativePart(doc.file);
            const prompt = "Você é um assistente médico especializado em analisar documentos. Analise a imagem deste documento médico e forneça um resumo conciso em português do Brasil. Extraia os principais dados, diagnósticos e quaisquer ações recomendadas. Formate o resumo de forma clara usando markdown (use cabeçalhos '##', listas com '-' e negrito com '**'). Se a imagem não parecer ser um documento médico ou for ilegível, informe educadamente que não foi possível analisar o conteúdo.";

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, { text: prompt }] },
            });
            
            setModalState(prev => ({ ...prev, summary: response.text, isLoading: false }));

        } catch (e) {
            console.error(e);
            setModalState(prev => ({ ...prev, error: 'Falha ao gerar o resumo. Verifique sua conexão ou tente novamente mais tarde.', isLoading: false }));
        }
    }

    const handleCloseModal = () => {
        setModalState({ isOpen: false, docName: '', summary: '', isLoading: false, error: '' });
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

  return (
    <>
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Meus Documentos</h3>
      <div className="overflow-x-auto">
        {documents.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Nome do Arquivo</th>
                <th scope="col" className="px-6 py-3">Data de Upload</th>
                <th scope="col" className="px-6 py-3">Tamanho</th>
                <th scope="col" className="px-6 py-3">Ações de IA</th>
                <th scope="col" className="px-6 py-3 text-right">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-2">
                    <DocumentTextIcon className="w-5 h-5 text-brand-blue" />
                    <span>{doc.name}</span>
                  </th>
                  <td className="px-6 py-4">
                    {doc.uploadDate.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    {formatFileSize(doc.size)}
                  </td>
                   <td className="px-6 py-4">
                     <button 
                        onClick={() => handleSummarize(doc)}
                        disabled={modalState.isLoading}
                        className="flex items-center space-x-2 text-sm font-medium text-brand-blue hover:text-brand-blue-dark disabled:opacity-50 disabled:cursor-wait transition-colors"
                        aria-label={`Summarizar ${doc.name}`}
                     >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Sumarizar</span>
                     </button>
                   </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDeleteRequest(doc.id)} className="font-medium text-red-600 hover:text-red-800 inline-flex items-center justify-center p-1 rounded-full hover:bg-red-50 transition-colors" aria-label={`Excluir ${doc.name}`}>
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-brand-gray py-4">Nenhum documento encontrado.</p>
        )}
      </div>
    </div>
    <SummaryModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        docName={modalState.docName}
        summary={modalState.summary}
        isLoading={modalState.isLoading}
        error={modalState.error}
    />
    </>
  );
};

export default DocumentList;