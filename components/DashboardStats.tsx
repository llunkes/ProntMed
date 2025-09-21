import React from 'react';
import { DocumentTextIcon, CalendarIcon, StethoscopeIcon } from './icons';

interface DashboardStatsProps {
    totalRecords: number;
    totalDocuments: number;
    upcomingAppointments: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ icon, label, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 transform transition-all hover:-translate-y-1 hover:shadow-xl`}>
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-brand-gray font-medium">{label}</p>
        </div>
    </div>
);


const DashboardStats: React.FC<DashboardStatsProps> = ({ totalRecords, totalDocuments, upcomingAppointments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            icon={<StethoscopeIcon className="w-7 h-7 text-blue-800" />}
            label="Registros na Linha do Tempo"
            value={totalRecords}
            color="bg-blue-100"
        />
        <StatCard 
            icon={<DocumentTextIcon className="w-7 h-7 text-green-800" />}
            label="Documentos Anexados"
            value={totalDocuments}
            color="bg-green-100"
        />
        <StatCard 
            icon={<CalendarIcon className="w-7 h-7 text-purple-800" />}
            label="Consultas Agendadas"
            value={upcomingAppointments}
            color="bg-purple-100"
        />
    </div>
  );
};

export default DashboardStats;
