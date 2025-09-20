import React, { useState } from 'react';
import { TimelineEvent, MedicalRecordType } from '../types';
import { XIcon } from './icons';

interface EditRecordModalProps {
  event: TimelineEvent;
  onSave: (updatedEvent: TimelineEvent) => void;
  onClose: () => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({ event, onSave, onClose }) => {
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState<MedicalRecordType>(event.type);
  const [description, setDescription] = useState(event.description);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Título e descrição são obrigatórios.');
      return;
    }
    onSave({
      ...event,
      title,
      type,
      description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-record-title">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative transform transition-all" onClick={e => e.stopPropagation()}>
         <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <h2 id="edit-record-title" className="text-2xl font-bold">Editar Registro</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
         </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">Tipo de Registro</label>
              <select
                id="edit-type"
                value={type}
                onChange={(e) => setType(e.target.value as MedicalRecordType)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue rounded-md"
              >
                {Object.values(MedicalRecordType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Descrição / Observações</label>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecordModal;