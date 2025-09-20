import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MedicalDocument, TimelineEvent, Appointment, MedicalRecordType } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import EditRecordModal from './components/EditRecordModal';
import EditAppointmentModal from './components/EditAppointmentModal';
import ConfirmationModal from './components/ConfirmationModal';
import Auth from './Auth';
import AddAppointmentModal from './components/AddAppointmentModal';

// Mock Data
const initialAppointments: Appointment[] = [
  { id: 'apt1', date: new Date(new Date().setDate(new Date().getDate() + 7)), doctor: 'Dr. House', specialty: 'Cardiologia', location: 'Hospital Central' },
  { id: 'apt2', date: new Date(new Date().setDate(new Date().getDate() + 15)), doctor: 'Dra. Grey', specialty: 'Dermatologia', location: 'Clínica Dermato' },
  { id: 'apt3', date: new Date(new Date().getTime() + 25 * 60 * 60 * 1000), doctor: 'Dr. Smith', specialty: 'Ortopedia', location: 'Clínica Orto' }, // For testing notifications
];

const initialTimelineEvents: TimelineEvent[] = [
  { id: 'evt1', date: new Date('2024-05-20'), type: MedicalRecordType.APPOINTMENT, title: 'Consulta de Rotina', description: 'Check-up anual com Dr. House. Tudo normal.' },
  { id: 'evt2', date: new Date('2024-04-15'), type: MedicalRecordType.EXAM, title: 'Exame de Sangue', description: 'Hemograma completo. Resultados anexados.' },
  { id: 'evt3', date: new Date('2024-04-15'), type: MedicalRecordType.PRESCRIPTION, title: 'Receita Vitamina D', description: 'Suplementação de Vitamina D por 3 meses.' },
];

const MainLayout: React.FC<{ user: { name: string }; onLogout: () => void }> = ({ user, onLogout }) => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimelineEvents);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'event' | 'appointment' | 'document'; id: string } | null>(null);

  // Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const notificationTimeoutIds = useRef<number[]>([]);


  useEffect(() => {
    if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
    }
  }, []);
  
  const handleToggleNotifications = useCallback(async (enabled: boolean) => {
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
            setNotificationsEnabled(true);
            localStorage.setItem('notificationsEnabled', 'true');
        } else {
            setNotificationsEnabled(false);
            localStorage.setItem('notificationsEnabled', 'false');
        }
    } else {
        setNotificationsEnabled(enabled);
        localStorage.setItem('notificationsEnabled', String(enabled));
    }
  }, []);

  useEffect(() => {
    notificationTimeoutIds.current.forEach(clearTimeout);
    notificationTimeoutIds.current = [];

    if (!notificationsEnabled || notificationPermission !== 'granted' || !('Notification' in window)) {
        return;
    }

    const now = new Date().getTime();

    appointments.forEach(apt => {
        const appointmentTime = apt.date.getTime();
        const notificationTime = appointmentTime - (24 * 60 * 60 * 1000);
        const delay = notificationTime - now;

        if (delay > 0) {
            const timeoutId = window.setTimeout(() => {
                new Notification('Lembrete de Consulta', {
                    body: `Sua consulta de ${apt.specialty} com ${apt.doctor} é amanhã.`,
                    icon: '/vite.svg',
                });
            }, delay);
            notificationTimeoutIds.current.push(timeoutId);
        }
    });

    return () => {
        notificationTimeoutIds.current.forEach(clearTimeout);
    };
  }, [appointments, notificationsEnabled, notificationPermission]);


  const addRecord = useCallback((event: Omit<TimelineEvent, 'id' | 'date'>, file?: File) => {
    const newEventId = `evt${Date.now()}`;
    const newEvent: TimelineEvent = {
      ...event,
      id: newEventId,
      date: new Date(),
    };

    if (file) {
      const newDocId = `doc${Date.now()}`;
      const newDocument: MedicalDocument = {
        id: newDocId,
        name: file.name,
        type: file.type,
        file: file,
        uploadDate: new Date(),
        size: file.size,
      };
      newEvent.documentId = newDocId;
      setDocuments(prev => [...prev, newDocument]);
    }

    setTimelineEvents(prev => [newEvent, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, []);

  const handleEditEvent = (event: TimelineEvent) => setEditingEvent(event);
  const handleEditAppointment = (appointment: Appointment) => setEditingAppointment(appointment);
  const handleAddAppointmentRequest = () => setIsAddingAppointment(true);

  const handleDeleteEventRequest = (id: string) => setItemToDelete({ type: 'event', id });
  const handleDeleteAppointmentRequest = (id: string) => setItemToDelete({ type: 'appointment', id });
  const handleDeleteDocumentRequest = (id: string) => setItemToDelete({ type: 'document', id });

  const handleCloseModals = () => {
    setEditingEvent(null);
    setEditingAppointment(null);
    setItemToDelete(null);
    setIsAddingAppointment(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'event') {
        setTimelineEvents(prev => prev.filter(e => e.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'appointment') {
        setAppointments(prev => prev.filter(a => a.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'document') {
        const docId = itemToDelete.id;
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        setTimelineEvents(prev => prev.map(evt => evt.documentId === docId ? { ...evt, documentId: undefined } : evt));
    }
    handleCloseModals();
  };


  const handleUpdateEvent = (updatedEvent: TimelineEvent) => {
    setTimelineEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e).sort((a, b) => b.date.getTime() - a.date.getTime()));
    handleCloseModals();
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a).sort((a, b) => a.date.getTime() - b.date.getTime()));
    handleCloseModals();
  };

  const handleAddAppointment = (newAppointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      id: `apt${Date.now()}`,
      ...newAppointmentData
    };
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => a.date.getTime() - b.date.getTime()));
    handleCloseModals();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header user={user} onLogout={onLogout} />
      <div className="flex-grow w-full max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          <main className="lg:col-span-9">
            <Dashboard
              timelineEvents={timelineEvents}
              documents={documents}
              onAddRecord={addRecord}
              onEditEvent={handleEditEvent}
              onDeleteEventRequest={handleDeleteEventRequest}
              onDeleteDocumentRequest={handleDeleteDocumentRequest}
            />
          </main>
          <aside className="lg:col-span-3 mt-8 lg:mt-0">
            <RightSidebar 
              appointments={appointments} 
              onEditAppointment={handleEditAppointment} 
              onDeleteAppointmentRequest={handleDeleteAppointmentRequest}
              onAddAppointmentRequest={handleAddAppointmentRequest}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={handleToggleNotifications}
              notificationPermission={notificationPermission}
            />
          </aside>
        </div>
      </div>
      <Footer />

      {editingEvent && (
        <EditRecordModal
          event={editingEvent}
          onSave={handleUpdateEvent}
          onClose={handleCloseModals}
        />
      )}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onSave={handleUpdateAppointment}
          onClose={handleCloseModals}
        />
      )}
      {isAddingAppointment && (
        <AddAppointmentModal 
          onSave={handleAddAppointment}
          onClose={handleCloseModals}
        />
      )}
       {itemToDelete && (
        <ConfirmationModal
          isOpen={!!itemToDelete}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message="Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        />
      )}
    </div>
  );
};


const App: React.FC = () => {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('prontmedUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('prontmedUser');
        }
        setIsLoading(false);
    }, []);

    const handleAuthSuccess = (authenticatedUser: { name: string }) => {
        setUser(authenticatedUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('prontmedUser');
        setUser(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!user) {
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    return <MainLayout user={user} onLogout={handleLogout} />;
};


export default App;