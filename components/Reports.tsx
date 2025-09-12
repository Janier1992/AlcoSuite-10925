


import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_CHART_DATA, CalendarIcon } from '../constants';
import { useTheme } from './ThemeContext';

const ReportGenerator: React.FC = () => {
    const { theme } = useTheme();
    const [reportParams, setReportParams] = useState({
        reportType: '',
        dateRange: 'last30',
        area: 'all'
    });
    const [generatedReport, setGeneratedReport] = useState<any>(null);
    
    const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
    const tooltipStyle = {
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      border: `1px solid ${gridColor}`,
      color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
    };

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportParams.reportType) {
            alert('Por favor, seleccione un tipo de reporte.');
            return;
        }
        // Simulate report generation
        setGeneratedReport({
            title: `Reporte de ${reportParams.reportType === 'defects' ? 'Defectos' : 'Costos'}`,
            params: { ...reportParams },
            data: {
                summary: [
                    { label: 'Inspecciones Totales', value: '1,482' },
                    { label: 'Unidades Aprobadas', value: '1,390 (93.8%)' },
                    { label: 'Unidades Rechazadas', value: '92 (6.2%)' },
                    { label: 'Principal Defecto', value: 'Perfilería' }
                ],
                chartData: MOCK_CHART_DATA.defects
            }
        });
    };
    
    const inputStyles = "w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none";
    const labelStyles = "font-medium text-slate-600 dark:text-slate-400 block mb-1";
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-300 mb-2">Generador de Reportes</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Seleccione los parámetros para generar un nuevo reporte consolidado.</p>
            
            <form onSubmit={handleGenerate} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-1">
                    <label htmlFor="reportType" className={labelStyles}>Tipo de Reporte:</label>
                    <select id="reportType" value={reportParams.reportType} onChange={e => setReportParams(p => ({...p, reportType: e.target.value}))} required className={inputStyles}>
                        <option value="">Seleccione...</option>
                        <option value="defects">Resumen de Defectos</option>
                        <option value="costs">Análisis de Costos</option>
                        <option value="efficiency">Eficiencia de Inspección</option>
                    </select>
                </div>
                 <div className="lg:col-span-1">
                    <label htmlFor="dateRange" className={labelStyles}>Rango de Fechas:</label>
                    <select id="dateRange" value={reportParams.dateRange} onChange={e => setReportParams(p => ({...p, dateRange: e.target.value}))} className={inputStyles}>
                        <option value="last7">Últimos 7 días</option>
                        <option value="last30">Últimos 30 días</option>
                        <option value="current_month">Mes Actual</option>
                        <option value="last_quarter">Último Trimestre</option>
                    </select>
                </div>
                 <div className="lg:col-span-1">
                    <label htmlFor="area" className={labelStyles}>Área:</label>
                    <select id="area" value={reportParams.area} onChange={e => setReportParams(p => ({...p, area: e.target.value}))} className={inputStyles}>
                        <option value="all">Todas las Áreas</option>
                        <option value="perfileria">Perfilería</option>
                        <option value="pintura">Pintura</option>
                        <option value="troquelados">Troquelados</option>
                    </select>
                </div>
                <div className="lg:col-span-1">
                    <button type="submit" className="w-full px-4 py-2 bg-sky-900 dark:bg-sky-700 text-white rounded-md hover:bg-sky-800 dark:hover:bg-sky-600 transition-colors font-semibold shadow-sm">Generar</button>
                </div>
            </form>

            {generatedReport && (
                <div className="mt-8 pt-6 border-t dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{generatedReport.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Report Summary */}
                        <div>
                            <h3 className="text-xl font-semibold text-sky-800 dark:text-sky-300 mb-3">Resumen de Datos</h3>
                            <div className="space-y-2">
                                {generatedReport.data.summary.map((item: any) => (
                                    <div key={item.label} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                        <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Report Chart */}
                        <div className="h-80">
                             <h3 className="text-xl font-semibold text-sky-800 dark:text-sky-300 mb-3 text-center">Gráfico de Defectos</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={generatedReport.data.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="name" stroke={axisColor} />
                                    <YAxis stroke={axisColor} />
                                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(14, 116, 144, 0.1)' }} />
                                    <Bar dataKey="value" name="Defectos" fill="#0369a1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;