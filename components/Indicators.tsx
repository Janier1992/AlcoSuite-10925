import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import Breadcrumbs from './Breadcrumbs';
import { useTheme } from './ThemeContext';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-sky-900 dark:text-sky-300 mb-4 text-center">{title}</h3>
        <div className="h-72">
            {children}
        </div>
    </div>
);

const Indicators: React.FC = () => {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
    const tooltipStyle = {
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      border: `1px solid ${gridColor}`,
      color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
    };
    
    return (
        <div>
            <div className="mb-6">
                <Breadcrumbs crumbs={[{ label: 'Calidad', path: '/quality/indicators' }, { label: 'Indicadores' }]} />
                <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-300 mt-2">Indicadores de Gestión</h1>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Rango de Fechas:</span>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1 text-sm bg-sky-700 dark:bg-sky-600 text-white rounded-full shadow-sm">Hoy</button>
                <button className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600">Últimos 7 días</button>
                <button className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600">Último Mes</button>
                <button className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600">Año Actual</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Defectos por Área">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_CHART_DATA.defects} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={axisColor} />
                            <YAxis stroke={axisColor} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(14, 116, 144, 0.1)' }}/>
                            <Legend />
                            <Bar dataKey="value" name="Defectos" fill="#0369a1" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Tiempos de Inspección (min)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_CHART_DATA.inspectionTimes} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={axisColor} />
                            <YAxis stroke={axisColor} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="Tiempo Prom." stroke="#10b981" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Aprobados vs. Rechazados">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={MOCK_CHART_DATA.approval}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                // FIX: Explicitly type the props for the label renderer to fix TypeScript error.
                                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {MOCK_CHART_DATA.approval.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                             <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard title="Tendencia de Calidad (%)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_CHART_DATA.qualityTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={axisColor} />
                            <YAxis domain={[90, 100]} stroke={axisColor} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="Índice Calidad" stroke="#f59e0b" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default Indicators;