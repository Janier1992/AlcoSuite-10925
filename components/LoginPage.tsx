import React, { useState } from 'react';
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
    onRegister: (newUser: Pick<User, 'username' | 'email' | 'password'>) => User | null;
    users: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister, users }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    
    // State for login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // State for registration
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const foundUser = users.find(
            user => user.email === loginEmail && user.password === loginPassword
        );

        if (foundUser) {
            onLogin(foundUser);
        } else {
            setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const registeredUser = onRegister({
            username: regUsername,
            email: regEmail,
            password: regPassword,
        });
        
        if (registeredUser) {
            // Automatically log in the user upon successful registration
            onLogin(registeredUser);
        } else {
            setError('El correo electrónico ya está en uso. Por favor, elija otro.');
        }
    };

    const baseInputClasses = "w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-400";
    const labelClasses = "block mb-1 text-sm text-slate-600 dark:text-slate-300 font-medium";

    return (
        <div 
          className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors"
        >
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-6">
                         <img src="https://raw.githubusercontent.com/Janier1992/pruebaalco2/main/img/LOGO.png.jpg" alt="Logo Alco" className="h-12 mx-auto mb-4" />
                         <h1 className="text-3xl font-bold text-[#0a4a6e] dark:text-sky-300">Alco Suite</h1>
                    </div>

                    {isRegistering ? (
                        // Registration Form
                        <div>
                            <h2 className="text-slate-800 dark:text-slate-100 text-center mb-1 text-xl font-bold">Crear Cuenta</h2>
                            <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-sm">Complete los campos para registrarse.</p>
                            
                            <form onSubmit={handleRegister} className="space-y-4">
                                {error && <p className="text-red-500 dark:text-red-400 text-center text-sm font-medium mb-4">{error}</p>}
                                <div>
                                    <label htmlFor="regUsername" className={labelClasses}>Nombre de Usuario:</label>
                                    <input type="text" id="regUsername" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required placeholder="Su nombre" className={`${baseInputClasses}`}/>
                                </div>
                                <div>
                                    <label htmlFor="regEmail" className={labelClasses}>Usuario (Email):</label>
                                    <input type="email" id="regEmail" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="ejemplo@alco.com" className={`${baseInputClasses} ${error ? 'bg-red-50 dark:bg-red-900/20' : ''}`}/>
                                </div>
                                <div>
                                    <label htmlFor="regPassword" className={labelClasses}>Contraseña:</label>
                                    <input type="password" id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="••••••••" className={`${baseInputClasses}`}/>
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-[#0a4a6e] text-white rounded-lg font-semibold hover:bg-[#083b5a] dark:bg-sky-700 dark:hover:bg-sky-600 transition-colors">Registrarse</button>
                            </form>
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                                ¿Ya tienes una cuenta? <button onClick={() => { setIsRegistering(false); setError(''); }} className="font-semibold text-sky-700 dark:text-sky-400 hover:underline">Inicia Sesión</button>
                            </p>
                        </div>
                    ) : (
                        // Login Form
                        <div>
                            <h2 className="text-slate-800 dark:text-slate-100 text-center mb-1 text-xl font-bold">Acceso al Sistema</h2>
                            <p className="text-center text-slate-500 dark:text-slate-400 mb-4 text-sm">Ingrese sus credenciales para continuar.</p>
                            
                            {error && <p className="text-red-500 dark:text-red-400 text-center text-sm font-medium mb-4">{error}</p>}

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className={labelClasses}>Usuario (Email):</label>
                                    <input type="email" id="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="ejemplo@alco.com" className={`${baseInputClasses} ${error ? 'bg-red-50 dark:bg-red-900/20' : ''}`}/>
                                </div>
                                <div>
                                    <label htmlFor="password" className={labelClasses}>Contraseña:</label>
                                    <input type="password" id="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="••••••••" className={`${baseInputClasses}`}/>
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-[#0a4a6e] text-white rounded-lg font-semibold hover:bg-[#083b5a] dark:bg-sky-700 dark:hover:bg-sky-600 transition-colors">
                                    Ingresar
                                </button>
                            </form>
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                                ¿No tienes una cuenta? <button onClick={() => { setIsRegistering(true); setError(''); }} className="font-semibold text-sky-700 dark:text-sky-400 hover:underline">Regístrate</button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;