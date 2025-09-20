import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

interface AuthProps {
    onAuthSuccess: (user: { name: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => setIsLoginView(!isLoginView);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            {isLoginView ? (
                <LoginPage onAuthSuccess={onAuthSuccess} onToggleView={toggleView} />
            ) : (
                <RegisterPage onAuthSuccess={onAuthSuccess} onToggleView={toggleView} />
            )}
        </div>
    );
};

export default Auth;
