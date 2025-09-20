import React, { useState } from 'react';
import { Appointment } from '../types';
import { XIcon } from './icons';

interface EditAppointmentModalProps {
  appointment: Appointment;
  onSave: (updatedAppointment: Appointment) => void;
  onClose: () => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ appointment, onSave, onClose }) => {
    const [doctor, setDoctor] = useState(appointment.doctor);
    const [specialty, setSpecialty] = useState(appointment.specialty);
    const [location, setLocation] = useState(appointment.location);
    const [error, setError] = useState('');

    const toInputDate = (date: Date): string => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const day = (`0${d.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };
    
    const [date, setDate] = useState(toInputDate(appointment.date));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!doctor.trim() || !specialty.trim() || !location.trim() || !date) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        
        const dateObject = new Date(`${date}T00:00:00`);

        onSave({
            ...appointment,
            doctor,
            specialty,
            location,
            date: dateObject,
        });
    }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-appointment-title">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 id="edit-appointment-title" className="text-2xl font-bold">Editar Consulta</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="edit-specialty" className="block text-sm font-medium text-gray-700">Especialidade</label>
                    <input
                        type="text"
                        id="edit-specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>
                <div>
                    <label htmlFor="edit-doctor" className="block text-sm font-medium text-gray-700">Médico(a)</label>
                    <input
                        type="text"
                        id="edit-doctor"
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>
                 <div>
                    <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">Local</label>
                    <input
                        type="text"
                        id="edit-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>
                <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">Data</label>
                    <input
                        type="date"
                        id="edit-date"
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
                Salvar Alterações
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default EditAppointmentModal;