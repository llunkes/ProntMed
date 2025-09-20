import React from 'react';
import { TimelineEvent, MedicalRecordType } from '../types';
import { StethoscopeIcon, BeakerIcon, DocumentTextIcon, PencilIcon, PencilSquareIcon, TrashIcon } from './icons';

interface TimelineProps {
  events: TimelineEvent[];
  onEdit: (event: TimelineEvent) => void;
  onDeleteRequest: (id: string) => void;
}

const EventIcon: React.FC<{ type: MedicalRecordType }> = ({ type }) => {
    const iconProps = { className: "w-6 h-6 text-white" };
    const iconMap = {
        [MedicalRecordType.APPOINTMENT]: <StethoscopeIcon {...iconProps} />,
        [MedicalRecordType.EXAM]: <BeakerIcon {...iconProps} />,
        [MedicalRecordType.PRESCRIPTION]: <DocumentTextIcon {...iconProps} />,
        [MedicalRecordType.NOTE]: <PencilIcon {...iconProps} />,
    };

    const colorMap = {
        [MedicalRecordType.APPOINTMENT]: 'bg-blue-500',
        [MedicalRecordType.EXAM]: 'bg-purple-500',
        [MedicalRecordType.PRESCRIPTION]: 'bg-green-500',
        [MedicalRecordType.NOTE]: 'bg-yellow-500',
    };

    return (
        <div className={`absolute left-0 -translate-x-1/2 w-12 h-12 ${colorMap[type]} rounded-full flex items-center justify-center ring-8 ring-white group-hover:ring-gray-50 transition-all duration-300`}>
            {iconMap[type]}
        </div>
    );
}

const Timeline: React.FC<TimelineProps> = ({ events, onEdit, onDeleteRequest }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Linha do Tempo da Saúde</h3>
      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {events.length > 0 ? (
          <div className="space-y-8">
            {events.map((event) => (
              <div key={event.id} className="relative pl-12 group">
                <EventIcon type={event.type} />
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 relative transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                   <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                          onClick={() => onEdit(event)} 
                          className="p-1 text-gray-400 hover:text-brand-blue rounded-full hover:bg-gray-200 transition-colors"
                          aria-label={`Editar ${event.title}`}
                      >
                          <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button 
                          onClick={() => onDeleteRequest(event.id)} 
                          className="p-1 text-gray-400 hover:text-brand-danger rounded-full hover:bg-red-50 transition-colors"
                          aria-label={`Excluir ${event.title}`}
                      >
                          <TrashIcon className="w-5 h-5" />
                      </button>
                   </div>
                  <p className="text-sm text-brand-gray">
                    {event.date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h4 className="font-bold text-lg mt-1 text-gray-900">{event.title}</h4>
                  <p className="text-gray-600 mt-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pl-12">
            <p className="text-brand-gray">Nenhum evento na sua linha do tempo ainda. Adicione um registro para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;