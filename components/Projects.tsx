import React, { useState, useRef, useEffect } from 'react';
import type { Column, Task, Priority, Label, UserAvatar, Attachment } from '../types';
import Breadcrumbs from './Breadcrumbs';
import { INITIAL_COLUMNS, AVAILABLE_LABELS, PROJECT_USERS, PaperclipIcon, PlusIcon, CameraIcon, DownloadIcon } from '../constants';

const CameraModal: React.FC<{ isOpen: boolean; onClose: () => void; onCapture: (imageSrc: string) => void; }> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("No se pudo acceder a la cámara. Asegúrese de haber otorgado los permisos necesarios.");
                onClose();
            }
        };

        const stopCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };

        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => stopCamera();
    }, [isOpen, onClose]);

    const handleCapture = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCapture(dataUrl);
            }
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[1002] flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300">Capturar Foto</h2>
                </div>
                <div className="p-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-md"></video>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t dark:border-slate-700">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleCapture} type="button" className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors flex items-center gap-2">
                        <CameraIcon /> Capturar
                    </button>
                </div>
            </div>
        </div>
    );
};

const AttachmentPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; attachment: Attachment | null }> = ({ isOpen, onClose, attachment }) => {
    if (!isOpen || !attachment) return null;

    const downloadAttachment = () => {
        const link = document.createElement('a');
        link.href = attachment.url;
        link.setAttribute('download', attachment.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const renderPreview = () => {
        if (attachment.type.startsWith('image/')) {
            return <img src={attachment.url} alt={attachment.name} className="max-w-full max-h-[60vh] mx-auto rounded-md" />;
        }
        if (attachment.type === 'application/pdf') {
            return <iframe src={attachment.url} className="w-full h-[70vh] border-0 rounded-md" title={attachment.name}></iframe>
        }
        return (
            <div className="p-4 h-48 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg border-2 border-dashed dark:border-slate-700 text-center">
                <i className="fas fa-file-alt text-4xl text-slate-400 dark:text-slate-500 mb-3"></i>
                <p className="text-slate-600 dark:text-slate-400 font-semibold">Vista Previa no Disponible</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                    No se puede previsualizar este tipo de archivo. Puede descargarlo para verlo.
                </p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[1002] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300 truncate pr-4">{attachment.name}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-2xl flex-shrink-0">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {renderPreview()}
                </div>
                <div className="flex justify-end gap-3 p-4 border-t dark:border-slate-700 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md">Cerrar</button>
                    <button onClick={downloadAttachment} className="px-4 py-2 bg-sky-700 text-white rounded-md flex items-center gap-2"><DownloadIcon /> Descargar</button>
                </div>
            </div>
        </div>
    );
};

const PRIORITY_STYLES: { [key in Priority]: string } = {
    'Baja': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Media': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Alta': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const LABEL_STYLES: { [key: string]: string } = {
    'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'green': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'red': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'gray': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};

const TaskCard: React.FC<{ task: Task; onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => void; columnId: string; onClick: () => void; }> = ({ task, onDragStart, columnId, onClick }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id, columnId)}
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm border-l-4 border-sky-500 dark:border-sky-400 mb-3 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 pr-2">{task.title}</h4>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.map(label => (
                <span key={label.id} className={`text-xs font-medium px-2 py-0.5 rounded ${LABEL_STYLES[label.color]}`}>{label.name}</span>
            ))}
        </div>
        
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                 {task.attachments.length > 0 && (
                    <span className="text-xs flex items-center gap-1" title={`${task.attachments.length} archivos adjuntos`}>
                        <PaperclipIcon /> {task.attachments.length}
                    </span>
                 )}
                 <span className="text-xs flex items-center gap-1"><i className="far fa-calendar"></i> {task.dueDate}</span>
            </div>
           
            <div className="flex -space-x-2">
                {task.assignedUsers.map(user => (
                    <div key={user.id} className="w-6 h-6 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800" title={user.initials}>
                        {user.initials}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const KanbanColumn: React.FC<{
    column: Column;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, destinationColumnId: string) => void;
    onViewTask: (task: Task) => void;
    onAddTask: (columnId: 'todo' | 'inprogress' | 'review' | 'done') => void;
}> = ({ column, onDragStart, onDragOver, onDrop, onViewTask, onAddTask }) => (
    <div
        className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-3 w-full md:w-72 lg:w-80 flex-shrink-0"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
    >
        <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-slate-700 dark:text-slate-200">{column.title}</h3>
            <span className="text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5">{column.tasks.length}</span>
        </div>
        <div className="h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {column.tasks.map(task => (
                <TaskCard key={task.id} task={task} onDragStart={onDragStart} columnId={column.id} onClick={() => onViewTask(task)} />
            ))}
        </div>
        <button onClick={() => onAddTask(column.id)} className="w-full mt-2 p-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
            + Añadir tarea
        </button>
    </div>
);


const DropdownManager: React.FC<{
    label: string;
    items: (UserAvatar | Label)[];
    selectedItems: (UserAvatar | Label)[];
    availableItems: (UserAvatar | Label)[];
    onAdd: (item: UserAvatar | Label) => void;
    onRemove: (itemId: string) => void;
}> = ({ label, items, selectedItems, availableItems, onAdd, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const isLabel = (item: any): item is Label => 'color' in item;

    return (
        <div>
            <label className="font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm">{label}</label>
            <div className="relative">
                <div className="flex flex-wrap gap-1 p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md min-h-[42px]">
                    {selectedItems.map(item => (
                        <span key={item.id} className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded ${isLabel(item) ? LABEL_STYLES[item.color] : 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'}`}>
                            {isLabel(item) ? item.name : item.initials}
                            <button onClick={() => onRemove(item.id)} className="font-bold">&times;</button>
                        </span>
                    ))}
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"><PlusIcon /></button>
                </div>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {availableItems.map(item => (
                            <div key={item.id} onClick={() => { onAdd(item); setIsOpen(false); }} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer">
                                {isLabel(item) ? item.name : item.initials}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const AttachmentsManager: React.FC<{
    attachments: Attachment[];
    onFilesAdd: (files: FileList) => void;
    onTakePhotoClick: () => void;
    onRemove: (attachmentId: string) => void;
    onView: (attachment: Attachment) => void;
}> = ({ attachments, onFilesAdd, onRemove, onTakePhotoClick, onView }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label className="font-medium text-slate-600 dark:text-slate-400 block mb-2 text-sm">Archivos Adjuntos</label>
            <div className="space-y-2">
                {attachments.map(att => (
                     <button
                        type="button"
                        key={att.id}
                        onClick={() => onView(att)}
                        className="w-full flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md text-left hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            {att.type.startsWith('image/') ? (
                                <img src={att.url} alt={att.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded flex items-center justify-center flex-shrink-0"><i className="fas fa-file-alt"></i></div>
                            )}
                            <div className="truncate">
                                <p className="text-sm font-medium truncate">{att.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{(att.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(att.id); }}
                            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 flex-shrink-0 z-10"
                        >
                            &times;
                        </button>
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2 text-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                    <PaperclipIcon /> Añadir archivo
                </button>
                 <button
                    type="button"
                    onClick={onTakePhotoClick}
                    className="w-full p-2 text-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                    <CameraIcon /> Tomar Foto
                </button>
            </div>

            <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => e.target.files && onFilesAdd(e.target.files)}
            />
        </div>
    );
};


const TaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (task: Task) => void;
    onDelete: (taskId: string) => void;
}> = ({ isOpen, onClose, task, onSave, onDelete }) => {
    const [editedTask, setEditedTask] = useState<Task | null>(task);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isCameraOpen, setCameraOpen] = useState(false);
    const [isPreviewOpen, setPreviewOpen] = useState(false);
    const [attachmentToView, setAttachmentToView] = useState<Attachment | null>(null);

    React.useEffect(() => {
        setEditedTask(task);
    }, [task]);

    if (!isOpen || !editedTask) return null;

    const handleSave = () => {
        onSave(editedTask);
        onClose();
    };
    
    const handleDeleteClick = () => setDeleteConfirmOpen(true);
    const handleConfirmDelete = () => {
        onDelete(editedTask.id);
        setDeleteConfirmOpen(false);
        onClose();
    };

    const handleFilesAdd = (files: FileList) => {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert(`El archivo "${file.name}" es demasiado grande (máx 10MB).`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAttachment: Attachment = {
                    id: `${Date.now()}-${file.name}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: e.target?.result as string,
                };
                setEditedTask(prev => prev ? { ...prev, attachments: [...prev.attachments, newAttachment] } : null);
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handlePhotoCapture = (imageSrc: string) => {
        const newAttachment: Attachment = {
            id: `capture-${Date.now()}`,
            name: `Captura-${new Date().toISOString().split('T')[0]}.jpg`,
            type: 'image/jpeg',
            url: imageSrc,
            // Estimate size from base64 string length
            size: (imageSrc.length * (3/4)) - (imageSrc.endsWith('==') ? 2 : (imageSrc.endsWith('=') ? 1 : 0)),
        };
        setEditedTask(prev => prev ? { ...prev, attachments: [...prev.attachments, newAttachment] } : null);
        setCameraOpen(false);
    };

    const handleViewAttachment = (attachment: Attachment) => {
        setAttachmentToView(attachment);
        setPreviewOpen(true);
    };
    
    const handleAttachmentRemove = (id: string) => setEditedTask(prev => prev ? { ...prev, attachments: prev.attachments.filter(a => a.id !== id) } : null);
    
    const handleUserAdd = (user: UserAvatar) => setEditedTask(prev => prev ? { ...prev, assignedUsers: [...prev.assignedUsers, user] } : null);
    const handleUserRemove = (id: string) => setEditedTask(prev => prev ? { ...prev, assignedUsers: prev.assignedUsers.filter(u => u.id !== id) } : null);

    const handleLabelAdd = (label: Label) => setEditedTask(prev => prev ? { ...prev, labels: [...prev.labels, label] } : null);
    const handleLabelRemove = (id: string) => setEditedTask(prev => prev ? { ...prev, labels: prev.labels.filter(l => l.id !== id) } : null);

    const inputStyles = "w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500";
    const labelStyles = "font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm";
    
    const availableUsers = PROJECT_USERS.filter(u => !editedTask.assignedUsers.some(au => au.id === u.id));
    const availableLabels = AVAILABLE_LABELS.filter(l => !editedTask.labels.some(sl => sl.id === l.id));


    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4" onClick={onClose}>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                        <input type="text" value={editedTask.title} onChange={(e) => setEditedTask({...editedTask, title: e.target.value})} className="text-xl font-bold text-sky-900 dark:text-sky-300 bg-transparent border-none p-0 focus:ring-0 w-full" />
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-2xl flex-shrink-0">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className={labelStyles}>Descripción</label>
                                <textarea value={editedTask.description} onChange={(e) => setEditedTask({...editedTask, description: e.target.value})} className={`${inputStyles} min-h-[120px]`}></textarea>
                            </div>
                            <AttachmentsManager
                                attachments={editedTask.attachments}
                                onFilesAdd={handleFilesAdd}
                                onRemove={handleAttachmentRemove}
                                onTakePhotoClick={() => setCameraOpen(true)}
                                onView={handleViewAttachment}
                            />
                        </div>
                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div>
                                <label className={labelStyles}>Prioridad</label>
                                <select value={editedTask.priority} onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as Priority})} className={inputStyles}>
                                    <option>Baja</option><option>Media</option><option>Alta</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelStyles}>Fecha Vencimiento</label>
                                <input type="date" value={editedTask.dueDate} onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})} className={`${inputStyles} dark:[color-scheme:dark]`} />
                            </div>
                            <DropdownManager label="Responsables" items={PROJECT_USERS} selectedItems={editedTask.assignedUsers} availableItems={availableUsers} onAdd={item => handleUserAdd(item as UserAvatar)} onRemove={handleUserRemove} />
                            <DropdownManager label="Etiquetas" items={AVAILABLE_LABELS} selectedItems={editedTask.labels} availableItems={availableLabels} onAdd={item => handleLabelAdd(item as Label)} onRemove={handleLabelRemove} />
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border-t dark:border-slate-700">
                        <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">Eliminar Tarea</button>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isDeleteConfirmOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-[1002] flex justify-center items-center">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-xl">
                        <h3 className="text-lg font-bold">Confirmar Eliminación</h3>
                        <p className="my-4">¿Está seguro de que desea eliminar esta tarea?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md">Cancelar</button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            <CameraModal isOpen={isCameraOpen} onClose={() => setCameraOpen(false)} onCapture={handlePhotoCapture} />
            <AttachmentPreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} attachment={attachmentToView} />
        </>
    );
};

const AddTaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, priority: Priority) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('Media');

    if (!isOpen) return null;

    const handleSave = () => {
        if (title.trim()) {
            onSave(title, priority);
            setTitle('');
            setPriority('Media');
            onClose();
        } else {
            alert('El título es obligatorio.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300">Nueva Tarea</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-2xl">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm">Título de la tarea</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-md focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="Ej: Revisar informe de calidad" />
                    </div>
                     <div>
                        <label className="font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm">Prioridad</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-md focus:ring-2 focus:ring-sky-500">
                            <option>Baja</option>
                            <option>Media</option>
                            <option>Alta</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t dark:border-slate-700">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-sky-700 text-white rounded-md">Crear Tarea</button>
                </div>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [newColumnId, setNewColumnId] = useState<keyof typeof INITIAL_COLUMNS | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => {
        e.dataTransfer.setData("taskId", taskId);
        e.dataTransfer.setData("sourceColumnId", sourceColumnId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, destinationColumnId: string) => {
        const taskId = e.dataTransfer.getData("taskId");
        const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

        if (sourceColumnId === destinationColumnId) return;

        let taskToMove: Task;
        const newColumns = { ...columns };
        
        const sourceColumn = newColumns[sourceColumnId as keyof typeof newColumns];
        const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
        [taskToMove] = sourceColumn.tasks.splice(taskIndex, 1);

        const destinationColumn = newColumns[destinationColumnId as keyof typeof newColumns];
        destinationColumn.tasks.push(taskToMove);

        setColumns(newColumns);
    };
    
    const handleViewTask = (task: Task) => {
        setSelectedTask(task);
        setViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setViewModalOpen(false);
        setSelectedTask(null);
    };

    const handleUpdateTask = (updatedTask: Task) => {
        const newColumns = { ...columns };
        for (const columnId in newColumns) {
            const taskIndex = newColumns[columnId as keyof typeof newColumns].tasks.findIndex(t => t.id === updatedTask.id);
            if (taskIndex !== -1) {
                newColumns[columnId as keyof typeof newColumns].tasks[taskIndex] = updatedTask;
                break;
            }
        }
        setColumns(newColumns);
    };
    
    const handleDeleteTask = (taskId: string) => {
        const newColumns = { ...columns };
        for (const columnId in newColumns) {
            newColumns[columnId as keyof typeof newColumns].tasks = newColumns[columnId as keyof typeof newColumns].tasks.filter(t => t.id !== taskId);
        }
        setColumns(newColumns);
    };
    
    const handleOpenAddTaskModal = (columnId: 'todo' | 'inprogress' | 'review' | 'done') => {
        setNewColumnId(columnId);
        setAddModalOpen(true);
    };

    const handleAddTask = (title: string, priority: Priority) => {
        if (!newColumnId) return;
        
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            priority,
            description: '',
            dueDate: new Date().toISOString().split('T')[0],
            labels: [],
            assignedUsers: [],
            attachments: [],
        };

        const newColumns = { ...columns };
        newColumns[newColumnId].tasks.push(newTask);
        setColumns(newColumns);
    };


    return (
        <>
            <div className="mb-6">
                <Breadcrumbs crumbs={[{ label: 'Proyectos' }]} />
                <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-300 mt-2">Tablero de Proyectos</h1>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {Object.values(columns).map(column => (
                    <KanbanColumn 
                        key={column.id} 
                        column={column}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onViewTask={handleViewTask}
                        onAddTask={handleOpenAddTaskModal}
                    />
                ))}
            </div>
            
            <TaskModal
                isOpen={isViewModalOpen}
                onClose={handleCloseModal}
                task={selectedTask}
                onSave={handleUpdateTask}
                onDelete={handleDeleteTask}
            />
            
            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSave={handleAddTask}
            />
        </>
    );
};

export default Projects;