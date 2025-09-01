import React from 'react';
import * as rr from 'react-router-dom';
const { Link } = rr;
import type { User } from '../types';
import { ClipboardCheckIcon, CogIcon, ChartPieIcon, NAV_ITEMS } from '../constants';

interface DashboardProps {
  user: User;
}

const WelcomeHeader: React.FC<{ username: string }> = ({ username }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">¡Bienvenido de nuevo, {username}!</h1>
    <p className="text-slate-500 dark:text-slate-400 mt-1">Aquí tienes un resumen de la actividad reciente y el estado del sistema.</p>
  </div>
);

const QuickActionButton: React.FC<{ icon: React.ReactNode; label: string; path: string }> = ({ icon, label, path }) => (
    <Link to={path} className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-800 text-slate-700 dark:text-slate-200 hover:text-sky-800 dark:hover:text-sky-300 rounded-lg transition-colors text-center shadow-sm">
        <div className="text-sky-700 dark:text-sky-400 mb-2">{icon}</div>
        <span className="font-semibold">{label}</span>
    </Link>
);


const KPICard: React.FC<{ icon: React.ReactNode; title: string; value: string; change: string; color: string; }> = ({ icon, title, value, change, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex items-start">
    <div className={`rounded-full p-3 mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{change}</p>
    </div>
  </div>
);

const RecentActivityItem: React.FC<{ icon: string; text: string; time: string; }> = ({ icon, text, time }) => (
    <li className="flex items-start py-3">
      <i className={`${icon} text-sky-600 dark:text-sky-400 w-5 text-center mr-4 mt-1`}></i>
      <div className="flex-1">
        <p className="text-slate-700 dark:text-slate-300">{text}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{time}</p>
      </div>
    </li>
);

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    return (
        <div>
            <WelcomeHeader username={user.username} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <QuickActionButton icon={<i className="fas fa-file-signature h-6 w-6"></i>} label="Nuevo Formulario" path={NAV_ITEMS[1].children![0].path} />
                        <QuickActionButton icon={<i className="fas fa-upload h-6 w-6"></i>} label="Subir Documento" path={NAV_ITEMS[1].children![1].path} />
                        <QuickActionButton icon={<i className="fas fa-chart-bar h-6 w-6"></i>} label="Ver Indicadores" path={NAV_ITEMS[1].children![2].path} />
                        <QuickActionButton icon={<i className="fas fa-print h-6 w-6"></i>} label="Generar Reporte" path={NAV_ITEMS[2].path} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KPICard 
                      icon={<CogIcon />}
                      title="OEE Global"
                      value="84.2%"
                      change="+2.1% vs mes ant."
                      color="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                    />
                    <KPICard 
                      icon={<ClipboardCheckIcon />}
                      title="Inspecciones"
                      value="1,245"
                      change="+58 hoy"
                      color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                    />
                    <KPICard 
                      icon={<ChartPieIcon />}
                      title="Índice Calidad"
                      value="95.7%"
                      change="-0.2% vs ayer"
                      color="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400"
                    />
                </div>

              </div>

              {/* Right Sidebar */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Actividad Reciente</h2>
                  <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                      <RecentActivityItem icon="fas fa-check-circle" text="Formulario #23-051 aprobado por Supervisor." time="hace 15 minutos" />
                      <RecentActivityItem icon="fas fa-exclamation-triangle" text="Alerta: Lote #L582 presenta 5% de defectos." time="hace 45 minutos" />
                      <RecentActivityItem icon="fas fa-folder-plus" text="Nuevo documento 'Norma-ISO-9001-2024.pdf' subido." time="hace 2 horas" />
                      <RecentActivityItem icon="fas fa-file-alt" text="Reporte 'Defectos Mensual - Mayo' generado." time="hace 5 horas" />
                      <RecentActivityItem icon="fas fa-check-circle" text="Formulario #23-050 aprobado." time="hace 8 horas" />
                  </ul>
              </div>
            </div>
        </div>
    );
};

export default Dashboard;