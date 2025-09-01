import React, { useState, useRef, useMemo } from 'react';
import type { Document } from '../types';
import { MOCK_DOCUMENTS, UploadIcon, SearchIcon, ViewIcon, DownloadIcon, DeleteIcon } from '../constants';
import Breadcrumbs from './Breadcrumbs';

const Library: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortKey, setSortKey] = useState('name_asc');
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
            const newDocument: Document = {
                id: Date.now(),
                name: file.name,
                type: 'Formato', // Mock type
                date: new Date().toISOString().split('T')[0],
                size: `${Math.round(file.size / 1024)} KB`,
            };
            setDocuments(prev => [newDocument, ...prev]);
        }
        event.target.value = ''; // Reset file input
    };

    const handleDelete = (id: number) => {
        if(window.confirm('¿Está seguro de que desea eliminar este documento?')) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        }
    };

    const handleView = (doc: Document) => {
        const previewContent = `
            <html>
                <head>
                    <title>Vista Previa: ${doc.name}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; background-color: #f0f2f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        .container { background-color: white; padding: 2rem 3rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 800px; }
                        h1 { color: #0c4a6e; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
                        p { line-height: 1.6; color: #374151; }
                        strong { color: #1f2937; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Visualizando: ${doc.name}</h1>
                        <p><strong>Tipo:</strong> ${doc.type}</p>
                        <p><strong>Fecha:</strong> ${doc.date}</p>
                        <p><strong>Tamaño:</strong> ${doc.size}</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0;" />
                        <p>Este es un contenido simulado. En una aplicación real, aquí se mostraría el contenido del archivo PDF, DOCX, etc.</p>
                    </div>
                </body>
            </html>
        `;
        const blob = new Blob([previewContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleDownload = (doc: Document) => {
        const fileContent = `Contenido simulado del documento:\n\nNombre: ${doc.name}\nTipo: ${doc.type}\nFecha: ${doc.date}\nTamaño: ${doc.size}`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name.split('.').slice(0, -1).join('.') + '.txt'; // Download as .txt for simulation
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const inputStyles = "w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none";
    const labelStyles = "block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1";

    return (
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
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
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
                                        <button onClick={() => handleView(doc)} className="p-2 text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors" title="Ver"><ViewIcon /></button>
                                        <button onClick={() => handleDownload(doc)} className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors" title="Descargar"><DownloadIcon /></button>
                                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors" title="Borrar"><DeleteIcon /></button>
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
    );
};

export default Library;