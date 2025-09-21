import React, { useState, useMemo } from 'react';
import { TimelineEvent, MedicalDocument, Appointment, MedicalRecordType } from '../types';
import FileUpload from './FileUpload';
import Timeline from './Timeline';
import DocumentList from './DocumentList';
import AdBanner from './AdBanner';
import ShareModal from './ShareModal';
import { ShareIcon } from './icons';
import DashboardStats from './DashboardStats';

interface DashboardProps {
  timelineEvents: TimelineEvent[];
  documents: MedicalDocument[];
  appointments: Appointment[];
  onAddRecord: (event: Omit<TimelineEvent, 'id' | 'date'>, file?: File) => void;
  onEditEvent: (event: TimelineEvent) => void;
  onDeleteEventRequest: (id: string) => void;
  onDeleteDocumentRequest: (docId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ timelineEvents, documents, appointments, onAddRecord, onEditEvent, onDeleteEventRequest, onDeleteDocumentRequest }) => {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<MedicalRecordType | 'all'>('all');

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || event.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [timelineEvents, searchTerm, filterType]);

  return (
    <div className="space-y-8">
      <DashboardStats 
        totalRecords={timelineEvents.length}
        totalDocuments={documents.length}
        upcomingAppointments={appointments.filter(a => a.date >= new Date()).length}
      />

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

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Filtrar Linha do Tempo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as MedicalRecordType | 'all')}
            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue rounded-md"
          >
            <option value="all">Todos os Tipos</option>
            {Object.values(MedicalRecordType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <Timeline events={filteredEvents} onEdit={onEditEvent} onDeleteRequest={onDeleteEventRequest} />

      <AdBanner width="100%" height={120} />

      <DocumentList documents={documents} onDeleteRequest={onDeleteDocumentRequest} />

      {isShareModalOpen && <ShareModal onClose={() => setShareModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
