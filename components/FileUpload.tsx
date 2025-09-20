import React, { useState, useRef } from 'react';
import { MedicalRecordType, TimelineEvent } from '../types';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onAddRecord: (event: Omit<TimelineEvent, 'id' | 'date'>, file?: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAddRecord }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MedicalRecordType>(MedicalRecordType.NOTE);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      // Lida com o caso em que o usuário cancela a seleção de arquivo
      setFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Título e descrição são obrigatórios.');
      return;
    }
    onAddRecord({ title, type, description }, file || undefined);
    setTitle('');
    setDescription('');
    setFile(null);
    setError('');
    // Reseta o input de arquivo usando a ref
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Adicionar Novo Registro</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Ex: Consulta Cardiologista"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Registro</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as MedicalRecordType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue rounded-md"
            >
              {Object.values(MedicalRecordType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição / Observações</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
            placeholder="Detalhes sobre a consulta, resultado do exame, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Anexar Arquivo (Opcional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload-input" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                  <span>Carregar um arquivo</span>
                  <input ref={fileInputRef} id="file-upload-input" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG até 10MB</p>
            </div>
          </div>
           {file && <p className="mt-2 text-sm text-gray-600">Arquivo selecionado: {file.name}</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="text-right">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300"
          >
            Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;