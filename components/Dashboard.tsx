import React, { useState } from 'react';
import { TimelineEvent, MedicalDocument } from '../types';
import FileUpload from './FileUpload';
import Timeline from './Timeline';
import DocumentList from './DocumentList';
import AdBanner from './AdBanner';
import ShareModal from './ShareModal';
import { ShareIcon } from './icons';

interface DashboardProps {
  timelineEvents: TimelineEvent[];
  documents: MedicalDocument[];
  onAddRecord: (event: Omit<TimelineEvent, 'id' | 'date'>, file?: File) => void;
  onEditEvent: (event: TimelineEvent) => void;
  onDeleteEventRequest: (id: string) => void;
  onDeleteDocumentRequest: (docId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ timelineEvents, documents, onAddRecord, onEditEvent, onDeleteEventRequest, onDeleteDocumentRequest }) => {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-brand-blue to-indigo-600 bg-clip-text text-transparent">
            Organize toda sua saúde em um único painel.
          </span>
        </h2>
        <p className="mt-4 text-lg text-brand-gray max-w-3xl mx-auto">
          Simples, seguro e gratuito. Adicione seus exames, consultas e receitas para começar a construir seu histórico médico digital.
        </p>
      </div>

      <div className="relative">
          <button
            onClick={() => setShareModalOpen(true)}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-brand-blue font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center space-x-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            aria-label="Compartilhar histórico de saúde"
          >
            <ShareIcon className="w-5 h-5" />
            <span>Compartilhar Histórico</span>
          </button>
          <FileUpload onAddRecord={onAddRecord} />
      </div>

      <Timeline events={timelineEvents} onEdit={onEditEvent} onDeleteRequest={onDeleteEventRequest} />

      <AdBanner width="100%" height={120} />

      <DocumentList documents={documents} onDeleteRequest={onDeleteDocumentRequest} />

      {isShareModalOpen && <ShareModal onClose={() => setShareModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;