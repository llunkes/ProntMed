import React from 'react';
import { BellIcon } from './icons';

interface NotificationSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  permission: NotificationPermission;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ enabled, onToggle, permission }) => {

  const getStatusMessage = () => {
    if (permission === 'denied') {
      return 'As notificações estão bloqueadas. Altere nas configurações do seu navegador.';
    }
    if (permission === 'default' && !enabled) {
      return 'Ative para receber lembretes de consultas.';
    }
    if (permission === 'granted' && enabled) {
        return 'Notificações estão ativadas.';
    }
    return 'Você precisa permitir as notificações no seu navegador.';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <BellIcon className="w-6 h-6 text-brand-blue mr-3" />
        <h3 className="text-xl font-bold text-gray-800">Configurações de Notificação</h3>
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="notification-toggle" className="flex-grow text-gray-700 font-medium">
            Lembretes de consulta 24h antes
        </label>
        <button
            id="notification-toggle"
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggle(!enabled)}
            disabled={permission === 'denied'}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue ${
                enabled ? 'bg-brand-blue' : 'bg-gray-300'
            } ${permission === 'denied' ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
              enabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      <p className="text-sm text-brand-gray mt-2">{getStatusMessage()}</p>
    </div>
  );
};

export default NotificationSettings;
