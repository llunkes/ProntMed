
export enum MedicalRecordType {
  APPOINTMENT = 'Consulta',
  EXAM = 'Exame',
  PRESCRIPTION = 'Receita',
  NOTE = 'Anotação',
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: string; // 'application/pdf', 'image/jpeg', etc.
  file: File;
  uploadDate: Date;
  size: number;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  type: MedicalRecordType;
  title: string;
  description: string;
  documentId?: string;
}

export interface Appointment {
  id: string;
  date: Date;
  doctor: string;
  specialty: string;
  location: string;
}
