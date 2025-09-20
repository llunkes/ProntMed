import React from 'react';
import { Appointment } from '../types';
import { CalendarIcon, PencilSquareIcon, TrashIcon, PlusIcon } from './icons';

interface AppointmentAlertsProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const AppointmentAlerts: React.FC<AppointmentAlertsProps> = ({ appointments, onEdit, onDelete, onAdd }) => {
  const now = new Date();
  
  const upcomingAppointments = appointments
    .filter(apt => apt.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const getDaysUntil = (date: Date) => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = appointmentDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Próximas Consultas</h3>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg px-3 py-1.5 transition-colors duration-300 shadow-sm hover:shadow-md"
          aria-label="Adicionar nova consulta"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Adicionar</span>
        </button>
      </div>
      {upcomingAppointments.length > 0 ? (
        <ul className="space-y-4">
          {upcomingAppointments.map((apt) => {
             const daysUntil = getDaysUntil(apt.date);
             return (
                <li key={apt.id} className="group flex items-start space-x-4 relative p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-brand-blue-light p-3 rounded-full flex-shrink-0">
                        <CalendarIcon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-900">{apt.specialty}</p>
                        <p className="text-sm text-brand-gray">{apt.doctor}</p>
                        <p className="text-sm text-brand-gray">{apt.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p className="text-sm font-medium text-brand-blue">
                            {daysUntil < 0 ? 'Concluída' : (daysUntil === 0 ? 'É hoje!' : (daysUntil === 1 ? 'É amanhã!' : `Em ${daysUntil} dias`))}
                        </p>
                    </div>
                    <div className="absolute top-1 right-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onEdit(apt)} 
                            className="p-1 text-gray-400 hover:text-brand-blue rounded-full hover:bg-gray-200 transition-colors"
                            aria-label={`Editar consulta ${apt.specialty}`}
                        >
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                         <button 
                            onClick={() => onDelete(apt.id)} 
                            className="p-1 text-gray-400 hover:text-brand-danger rounded-full hover:bg-red-50 transition-colors"
                            aria-label={`Excluir consulta ${apt.specialty}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </li>
             )
          })}
        </ul>
      ) : (
        <p className="text-brand-gray">Nenhuma consulta agendada.</p>
      )}
    </div>
  );
};

export default AppointmentAlerts;