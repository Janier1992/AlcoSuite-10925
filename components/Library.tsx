

import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { Document } from '../types';
import { MOCK_DOCUMENTS, UploadIcon, SearchIcon, ViewIcon, DownloadIcon, DeleteIcon } from '../constants';
import Breadcrumbs from './Breadcrumbs';

// Declare jsPDF global from the script tag in index.html
declare global {
    interface Window {
        jspdf: any;
    }
}

const Modal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode;
    size?: 'md' | '3xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    
    const sizeClass = size === 'md' ? 'max-w-md' : 'max-w-3xl';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4" onClick={onClose}>
            <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full ${sizeClass} max-h-[95vh] flex flex-col`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300 truncate pr-4">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-2xl flex-shrink-0">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};


const Library: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortKey, setSortKey] = useState('name_asc');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [documentToView, setDocumentToView] = useState<Document | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredAndSortedDocuments = useMemo(() => {
        let docs = documents
            .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(doc => filterType ? doc.type === filterType : true);

        docs.sort((a, b) => {
            switch (sortKey) {
                case 'name_desc': return b.name.localeCompare(a.name);
                case 'date_new': return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'date_old': return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'name_asc':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return docs;
    }, [documents, searchTerm, filterType, sortKey]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            const newDocument: Document = {
                id: Date.now(),
                name: file.name,
                type: 'Formato', // Mock type
                date: new Date().toISOString().split('T')[0],
                size: `${Math.round(file.size / 1024)} KB`,
                url: fileUrl,
            };
            setDocuments(prev => [newDocument, ...prev]);
        }
        event.target.value = ''; // Reset file input
    };
    
    const handleOpenDeleteModal = (doc: Document) => {
        setDocumentToDelete(doc);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            // Revoke the object URL to prevent memory leaks
            if (documentToDelete.url) {
                URL.revokeObjectURL(documentToDelete.url);
            }
            setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
            setDeleteModalOpen(false);
            setDocumentToDelete(null);
        }
    };

    const handleView = (doc: Document) => {
        // For uploaded PDFs, open the file in a new tab for a reliable preview.
        if (doc.url && doc.name.toLowerCase().endsWith('.pdf')) {
            window.open(doc.url, '_blank');
        } else {
            // For mock documents or other file types, show the metadata modal.
            setDocumentToView(doc);
            setViewModalOpen(true);
        }
    };
    
    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setDocumentToView(null);
    };

    const downloadOriginalFile = (doc: Document) => {
        if (!doc.url) return;
        const link = document.createElement('a');
        link.href = doc.url;
        link.setAttribute('download', doc.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPdfSummary = (doc: Document) => {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("La biblioteca PDF no se pudo cargar. Inténtelo de nuevo.");
            return;
        }
        const pdf = new jsPDF();

        pdf.setFontSize(22);
        pdf.setTextColor("#0a4a6e"); // Alco brand color
        pdf.text("Detalles del Documento", 20, 30);
        
        pdf.setDrawColor(200);
        pdf.line(20, 35, 190, 35); // line under title

        pdf.setFontSize(12);
        pdf.setTextColor(40);
        pdf.text(`Nombre:`, 20, 50);
        pdf.text(`Tipo:`, 20, 60);
        pdf.text(`Fecha de Subida:`, 20, 70);
        pdf.text(`Tamaño:`, 20, 80);

        pdf.setTextColor(100);
        pdf.text(`${doc.name}`, 70, 50);
        pdf.text(`${doc.type}`, 70, 60);
        pdf.text(`${doc.date}`, 70, 70);
        pdf.text(`${doc.size}`, 70, 80);
        
        pdf.line(20, 90, 190, 90); // line after details

        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text("Este documento fue generado automáticamente por Alco Suite.", 20, 100, { align: 'left' });

        const safeFileName = doc.name.split('.').slice(0, -1).join('.') || doc.name;
        pdf.save(`${safeFileName}_detalles.pdf`);
    };

    const handleDownload = (doc: Document) => {
        // If the document has a URL, it's an uploaded file. Download it directly.
        if (doc.url) {
            downloadOriginalFile(doc);
        } else {
            // Otherwise, it's a mock document. Generate the summary PDF.
            downloadPdfSummary(doc);
        }
    };
    
    const getFileIcon = (doc: Document) => {
        const lowerName = doc.name.toLowerCase();
        if (lowerName.endsWith('.pdf')) {
            return <i className="fas fa-file-pdf text-red-500 text-7xl"></i>;
        }
        if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
            return <i className="fas fa-file-word text-blue-500 text-7xl"></i>;
        }
        return <i className="fas fa-file-alt text-slate-500 text-7xl"></i>;
    };

    const inputStyles = "w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500";
    const labelStyles = "block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1";

    return (
        <>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
                <div className="mb-6">
                     <Breadcrumbs crumbs={[{ label: 'Calidad', path: '/quality/library' }, { label: 'Biblioteca' }]} />
                     <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-300 mt-2">Biblioteca de Archivos</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6">
                    <div className="lg:col-span-2">
                        <label htmlFor="documentSearch" className={labelStyles}>Buscar por nombre:</label>
                        <div className="relative">
                            <input type="text" id="documentSearch" placeholder="Ej: Manual-Calidad..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${inputStyles} pl-10`} />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"><SearchIcon /></div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="documentType" className={labelStyles}>Filtrar por tipo:</label>
                        <select id="documentType" value={filterType} onChange={e => setFilterType(e.target.value)} className={inputStyles}><option value="">Todos</option><option value="Instructivo">Instructivos</option><option value="Manual">Manuales</option><option value="Ficha">Fichas</option><option value="Norma">Normas</option><option value="Formato">Formatos</option></select>
                    </div>
                    <div>
                         <label htmlFor="sortFilesBy" className={labelStyles}>Ordenar por:</label>
                        <select id="sortFilesBy" value={sortKey} onChange={e => setSortKey(e.target.value)} className={inputStyles}><option value="name_asc">Nombre A-Z</option><option value="name_desc">Nombre Z-A</option><option value="date_new">Recientes</option><option value="date_old">Antiguos</option></select>
                    </div>
                </div>
                
                <div className="mb-6">
                    <button onClick={handleUploadClick} className="px-4 py-2 bg-sky-900 dark:bg-sky-700 text-white rounded-md hover:bg-sky-800 dark:hover:bg-sky-600 transition-colors flex items-center shadow-sm"><UploadIcon /> Subir Documento</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-700">
                                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Nombre</th>
                                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Tipo</th>
                                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 hidden lg:table-cell">Fecha</th>
                                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 hidden lg:table-cell">Tamaño</th>
                                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedDocuments.length > 0 ? filteredAndSortedDocuments.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 border-b dark:border-slate-700">
                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{doc.name}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{doc.type}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400 hidden lg:table-cell">{doc.date}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400 hidden lg:table-cell">{doc.size}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleView(doc)} className="p-2 rounded-full text-sky-600 hover:bg-sky-100 hover:text-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/50 dark:hover:text-sky-300 transition-colors" title="Ver"><ViewIcon /></button>
                                            <button onClick={() => handleDownload(doc)} className="p-2 rounded-full text-green-600 hover:bg-green-100 hover:text-green-800 dark:text-green-500 dark:hover:bg-green-900/50 dark:hover:text-green-400 transition-colors" title="Descargar"><DownloadIcon /></button>
                                            <button onClick={() => handleOpenDeleteModal(doc)} className="p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300 transition-colors" title="Borrar"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                 <tr>
                                    <td colSpan={5} className="text-center p-4 text-slate-500 dark:text-slate-400">
                                        No se encontraron documentos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirmar Eliminación">
                {documentToDelete && (
                    <>
                        <p className="text-slate-600 dark:text-slate-300">
                            ¿Está seguro de que desea eliminar el documento "<strong>{documentToDelete.name}</strong>"?
                            <br />
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Eliminar</button>
                        </div>
                    </>
                )}
            </Modal>
             {documentToView && (
                <Modal 
                    isOpen={isViewModalOpen} 
                    onClose={handleCloseViewModal} 
                    title={`Detalles: ${documentToView.name}`}
                    size="3xl"
                >
                    <div className="space-y-6">
                        {/* Metadata Section */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 w-full md:w-28 flex justify-center items-center bg-slate-100 dark:bg-slate-700/50 p-6 rounded-lg">
                                {getFileIcon(documentToView)}
                            </div>
                            <div className="flex-grow">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Nombre del Archivo:</p>
                                        <p className="text-base text-slate-800 dark:text-slate-200 break-all">{documentToView.name}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t dark:border-slate-600">
                                         <div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tipo:</p>
                                            <p className="text-base text-slate-800 dark:text-slate-200">{documentToView.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Fecha de Subida:</p>
                                            <p className="text-base text-slate-800 dark:text-slate-200">{documentToView.date}</p>
                                        </div>
                                         <div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tamaño:</p>
                                            <p className="text-base text-slate-800 dark:text-slate-200">{documentToView.size}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div>
                           <div className="p-4 h-32 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg border-2 border-dashed dark:border-slate-700 text-center">
                                <i className="fas fa-eye-slash text-3xl text-slate-400 dark:text-slate-500 mb-2"></i>
                                <p className="text-slate-600 dark:text-slate-400 font-semibold">
                                    Vista Previa no Disponible
                                </p>
                                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                                    {documentToView.url
                                        ? "La previsualización en la aplicación solo está disponible para archivos PDF."
                                        : "Esta es una vista de metadatos. La vista previa del contenido no está disponible."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t dark:border-slate-700">
                        <button onClick={handleCloseViewModal} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cerrar</button>
                        <button 
                            onClick={() => { if (documentToView) handleDownload(documentToView); }}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2">
                            <DownloadIcon /> Descargar
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Library;