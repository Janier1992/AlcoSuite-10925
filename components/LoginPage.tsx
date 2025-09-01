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

    const inputClasses = "w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500";
    const labelClasses = "block mb-1 text-sm text-slate-600 font-medium";

    return (
        <div 
          className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-4 bg-cover bg-center"
          style={{ backgroundImage: "url('https://raw.githubusercontent.com/Janier1992/pruebaalco2/main/img/fondo.jpg')" }}
        >
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-6">
                         <img src="https://raw.githubusercontent.com/Janier1992/pruebaalco2/main/img/LOGO.png.jpg" alt="Logo Alco" className="h-12 mx-auto mb-4" />
                         <h1 className="text-3xl font-bold text-[#0a4a6e]">Alco Suite</h1>
                    </div>

                    {isRegistering ? (
                        // Registration Form
                        <div>
                            <h2 className="text-slate-800 text-center mb-1 text-xl font-bold">Crear Cuenta</h2>
                            <p className="text-center text-slate-500 mb-6 text-sm">Complete los campos para registrarse.</p>
                            
                            <form onSubmit={handleRegister} className="space-y-4">
                                {error && <p className="text-red-500 text-center text-xs font-semibold">{error}</p>}
                                <div>
                                    <label htmlFor="regUsername" className={labelClasses}>Nombre de Usuario:</label>
                                    <input type="text" id="regUsername" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required placeholder="Su nombre" className={inputClasses}/>
                                </div>
                                <div>
                                    <label htmlFor="regEmail" className={labelClasses}>Usuario (Email):</label>
                                    <input type="email" id="regEmail" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="ejemplo@alco.com" className={inputClasses}/>
                                </div>
                                <div>
                                    <label htmlFor="regPassword" className={labelClasses}>Contraseña:</label>
                                    <input type="password" id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="••••••••" className={inputClasses}/>
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-[#0a4a6e] text-white rounded-lg font-semibold hover:bg-[#083b5a] transition-colors">Registrarse</button>
                            </form>
                            <p className="text-center text-sm text-slate-600 mt-6">
                                ¿Ya tienes una cuenta? <button onClick={() => { setIsRegistering(false); setError(''); }} className="font-semibold text-sky-700 hover:underline">Inicia Sesión</button>
                            </p>
                        </div>
                    ) : (
                        // Login Form
                        <div>
                            <h2 className="text-slate-800 text-center mb-1 text-xl font-bold">Acceso al Sistema</h2>
                            <p className="text-center text-slate-500 mb-6 text-sm">Ingrese sus credenciales para continuar.</p>
                            
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && <p className="text-red-500 text-center text-xs font-semibold">{error}</p>}
                                <div>
                                    <label htmlFor="email" className={labelClasses}>Usuario (Email):</label>
                                    <input type="email" id="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="ejemplo@alco.com" className={inputClasses}/>
                                </div>
                                <div>
                                    <label htmlFor="password" className={labelClasses}>Contraseña:</label>
                                    <input type="password" id="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="••••••••" className={inputClasses}/>
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-[#0a4a6e] text-white rounded-lg font-semibold hover:bg-[#083b5a] transition-colors">
                                    Ingresar
                                </button>
                            </form>
                            <p className="text-center text-sm text-slate-600 mt-6">
                                ¿No tienes una cuenta? <button onClick={() => { setIsRegistering(true); setError(''); }} className="font-semibold text-sky-700 hover:underline">Regístrate</button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
             <footer className="absolute bottom-4">
                <p className="text-center text-xs text-white/80 bg-slate-900/50 px-4 py-2 rounded-full">
                    © 2025 Desarrollado por Geankarlo Paz Muñoz & Janier Mosquera Mosquera
                </p>
             </footer>
        </div>
    );
};

export default LoginPage;
