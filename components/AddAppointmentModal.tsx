import React, { useState } from 'react';
import { Appointment } from '../types';
import { XIcon } from './icons';

interface AddAppointmentModalProps {
  onSave: (newAppointment: Omit<Appointment, 'id'>) => void;
  onClose: () => void;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ onSave, onClose }) => {
    const [doctor, setDoctor] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!doctor.trim() || !specialty.trim() || !location.trim() || !date) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        
        // The time is set to noon to avoid timezone issues where the date might shift by one day.
        const dateObject = new Date(`${date}T12:00:00`);

        onSave({
            doctor,
            specialty,
            location,
            date: dateObject,
        });
    }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-appointment-title">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 id="add-appointment-title" className="text-2xl font-bold">Adicionar Nova Consulta</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="add-specialty" className="block text-sm font-medium text-gray-700">Especialidade</label>
                    <input
                        type="text"
                        id="add-specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Ex: Cardiologia"
                    />
                </div>
                <div>
                    <label htmlFor="add-doctor" className="block text-sm font-medium text-gray-700">Médico(a)</label>
                    <input
                        type="text"
                        id="add-doctor"
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                         placeholder="Ex: Dr. House"
                    />
                </div>
                 <div>
                    <label htmlFor="add-location" className="block text-sm font-medium text-gray-700">Local</label>
                    <input
                        type="text"
                        id="add-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Ex: Hospital Central"
                    />
                </div>
                <div>
                    <label htmlFor="add-date" className="block text-sm font-medium text-gray-700">Data</label>
                    <input
                        type="date"
                        id="add-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>
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
                Salvar Consulta
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddAppointmentModal;