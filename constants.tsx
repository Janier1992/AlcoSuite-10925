
import React from 'react';
import type { NavItem } from './types';

export const TachometerIcon = () => (<i className="fas fa-tachometer-alt w-5 h-5"></i>);
export const CheckCircleIcon = () => (<i className="fas fa-check-circle w-5 h-5"></i>);
export const ClipboardListIcon = () => (<i className="fas fa-clipboard-list w-5 h-5"></i>);
export const FolderOpenIcon = () => (<i className="fas fa-folder-open w-5 h-5"></i>);
export const ChartLineIcon = () => (<i className="fas fa-chart-line w-5 h-5"></i>);
export const FileAltIcon = () => (<i className="fas fa-file-alt w-5 h-5"></i>);
export const SignOutIcon = () => (<i className="fas fa-sign-out-alt w-5 h-5"></i>);
// FIX: Update ChevronDownIcon to accept a className prop to allow for dynamic styling (e.g., rotation).
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (<i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${className || ''}`}></i>);
export const ChevronRightIcon = () => (<i className="fas fa-chevron-right text-xs transition-transform duration-300"></i>);

export const Bars3Icon = () => (<i className="fas fa-bars h-5 w-5"></i>);
export const XMarkIcon = () => (<i className="fas fa-times h-5 w-5"></i>);
export const ChevronDoubleLeftIcon = () => (<i className="fas fa-angle-double-left h-5 w-5"></i>);
export const ChevronDoubleRightIcon = () => (<i className="fas fa-angle-double-right h-5 w-5"></i>);
export const UploadIcon = () => (<i className="fas fa-upload mr-2"></i>);
export const SearchIcon = () => (<i className="fas fa-search"></i>);
export const ViewIcon = () => (<i className="fas fa-eye"></i>);
export const DownloadIcon = () => (<i className="fas fa-download"></i>);
export const DeleteIcon = () => (<i className="fas fa-trash"></i>);

export const ClipboardCheckIcon = () => <i className="fas fa-clipboard-check h-8 w-8"></i>;
export const CogIcon = () => <i className="fas fa-cog h-8 w-8"></i>;
export const ChartPieIcon = () => <i className="fas fa-chart-pie h-8 w-8"></i>;

export const BellIcon = () => <i className="fas fa-bell h-5 w-5"></i>;
export const UserCircleIcon = () => <i className="fas fa-user-circle h-6 w-6 text-slate-500 dark:text-slate-400"></i>;

export const CalendarIcon = () => <i className="fas fa-calendar-alt mr-2"></i>

export const SunIcon = () => <i className="fas fa-sun h-5 w-5"></i>;
export const MoonIcon = () => <i className="fas fa-moon h-5 w-5"></i>;

export const NAV_ITEMS: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard Principal',
        path: '/dashboard',
        icon: TachometerIcon,
    },
    {
        id: 'quality',
        label: 'Calidad',
        path: '/quality',
        icon: CheckCircleIcon,
        children: [
            {
                id: 'forms',
                label: 'Formularios',
                path: '/quality/forms',
                icon: ClipboardListIcon,
            },
            {
                id: 'library',
                label: 'Biblioteca',
                path: '/quality/library',
                icon: FolderOpenIcon,
            },
            {
                id: 'indicators',
                label: 'Indicadores',
                path: '/quality/indicators',
                icon: ChartLineIcon,
            },
        ],
    },
    {
        id: 'reports',
        label: 'Reportes',
        path: '/reports',
        icon: FileAltIcon,
    },
];

export const MOCK_DOCUMENTS = [
  { id: 1, name: "Manual-Calidad-v3.pdf", type: "Manual", date: "2024-05-20", size: "2.5 MB" },
  { id: 2, name: "Instructivo-Troquelado-P3.docx", type: "Instructivo", date: "2024-05-18", size: "780 KB" },
  { id: 3, name: "Norma-ISO-9001.pdf", type: "Norma", date: "2023-01-15", size: "1.2 MB" },
  { id: 4, name: "Ficha-Tecnica-Perfil-A45.xlsx", type: "Ficha", date: "2024-04-30", size: "150 KB" },
  { id: 5, name: "Formato-Inspeccion-Despachos.pdf", type: "Formato", date: "2024-02-10", size: "95 KB" },
];

export const MOCK_CHART_DATA = {
  defects: [
    { name: 'Perfilería', value: 40 },
    { name: 'Pintura', value: 30 },
    { name: 'Troquelados', value: 20 },
    { name: 'Felpa', value: 27 },
    { name: 'Vidrio', value: 18 },
    { name: 'Despachos', value: 23 },
  ],
  inspectionTimes: [
    { name: 'Ene', value: 12 },
    { name: 'Feb', value: 15 },
    { name: 'Mar', value: 13 },
    { name: 'Abr', value: 17 },
    { name: 'May', value: 18 },
    { name: 'Jun', value: 16 },
  ],
  approval: [
    { name: 'Aprobado', value: 400, fill: '#22c55e' },
    { name: 'Rechazado', value: 58, fill: '#ef4444' },
  ],
  qualityTrend: [
    { name: 'Sem 1', value: 92.1 },
    { name: 'Sem 2', value: 93.5 },
    { name: 'Sem 3', value: 91.8 },
    { name: 'Sem 4', value: 94.2 },
    { name: 'Sem 5', value: 95.0 },
    { name: 'Sem 6', value: 94.7 },
  ],
};