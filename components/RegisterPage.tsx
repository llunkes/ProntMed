import React, { useState } from 'react';
import { PlusCircleIcon } from './icons';

interface RegisterPageProps {
    onAuthSuccess: (user: { name: string }) => void;
    onToggleView: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onAuthSuccess, onToggleView }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        setError('');
        // Simulate successful registration and login
        localStorage.setItem('prontmedUser', JSON.stringify({ name }));
        onAuthSuccess({ name });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
                <PlusCircleIcon className="w-12 h-12 text-brand-blue" />
                <h2 className="mt-2 text-3xl font-bold text-gray-800">Crie sua conta no ProntMed</h2>
                <p className="text-brand-gray">É rápido e fácil.</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Seu Nome"
                    />
                </div>
                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="seu@email.com"
                    />
                </div>
                <div>
                    <label htmlFor="reg-password"className="block text-sm font-medium text-gray-700">Senha</label>
                    <input
                        type="password"
                        id="reg-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Mínimo de 6 caracteres"
                    />
                </div>
                 {error && <p className="text-sm text-red-600">{error}</p>}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-300"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-brand-gray">
                Já tem uma conta?{' '}
                <button onClick={onToggleView} className="font-medium text-brand-blue hover:text-brand-blue-dark focus:outline-none">
                    Faça login
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;
