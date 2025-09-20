import React from 'react';
import { Appointment } from '../types';
import AppointmentAlerts from './AppointmentAlerts';
import AdBanner from './AdBanner';
import NotificationSettings from './NotificationSettings';

interface RightSidebarProps {
  appointments: Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointmentRequest: (id: string) => void;
  onAddAppointmentRequest: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  notificationPermission: NotificationPermission;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
  appointments, 
  onEditAppointment, 
  onDeleteAppointmentRequest,
  onAddAppointmentRequest,
  notificationsEnabled,
  onToggleNotifications,
  notificationPermission
}) => {
  return (
    <div className="sticky top-8 space-y-8">
      <NotificationSettings 
        enabled={notificationsEnabled}
        onToggle={onToggleNotifications}
        permission={notificationPermission}
      />
      <AppointmentAlerts 
        appointments={appointments} 
        onEdit={onEditAppointment} 
        onDelete={onDeleteAppointmentRequest} 
        onAdd={onAddAppointmentRequest}
      />
      <AdBanner width="100%" height={600} />
    </div>
  );
};

export default RightSidebar;