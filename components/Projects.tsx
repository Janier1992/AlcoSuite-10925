import React, { useState } from 'react';
import type { Column, Task, Priority, Label, UserAvatar } from '../types';
import Breadcrumbs from './Breadcrumbs';

const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Diseñar interfaz de usuario', description: 'Crear mockups y prototipos de alta fidelidad para la nueva plataforma.', priority: 'Alta', dueDate: '2024-09-23', labels: [{id: 'l1', name: 'Diseño', color: 'purple'}], assignedUsers: [{id: 'u1', initials: 'JD'}, {id: 'u2', initials: 'AS'}]},
    { id: '2', title: 'Configurar base de datos', description: 'Instalar y configurar la base de datos PostgreSQL en el servidor de desarrollo.', priority: 'Media', dueDate: '2024-09-25', labels: [{id: 'l2', name: 'Backend', color: 'blue'}], assignedUsers: [{id: 'u3', initials: 'MR'}]},
    { id: '3', title: 'Investigar tecnologías de despliegue', description: 'Analizar opciones como Docker, Kubernetes y Vercel para el despliegue de la aplicación.', priority: 'Baja', dueDate: '2024-09-30', labels: [{id: 'l3', name: 'DevOps', color: 'yellow'}], assignedUsers: [{id: 'u1', initials: 'JD'}]},
    { id: '4', title: 'Desarrollar módulo de autenticación', description: 'Implementar el registro de usuarios, inicio de sesión y gestión de tokens JWT.', priority: 'Alta', dueDate: '2024-09-28', labels: [{id: 'l2', name: 'Backend', color: 'blue'}, {id: 'l4', name: 'Seguridad', color: 'green'}], assignedUsers: [{id: 'u3', initials: 'MR'}, {id: 'u2', initials: 'AS'}]},
    { id: '5', title: 'Crear componentes UI reutilizables', description: 'Desarrollar componentes base como botones, modales y tarjetas en React.', priority: 'Media', dueDate: '2024-09-26', labels: [{id: 'l5', name: 'Frontend', color: 'purple'}], assignedUsers: [{id: 'u1', initials: 'JD'}]},
    { id: '6', title: 'Revisar arquitectura del sistema', description: 'Validar el diseño de la arquitectura de microservicios propuesta.', priority: 'Media', dueDate: '2024-09-27', labels: [{id: 'l6', name: 'Arquitectura', color: 'yellow'}], assignedUsers: [{id: 'u3', initials: 'MR'}, {id: 'u1', initials: 'JD'}]},
    { id: '7', title: 'Definir requisitos del proyecto', description: 'Documentar los requerimientos funcionales y no funcionales del proyecto.', priority: 'Baja', dueDate: '2024-09-15', labels: [{id: 'l7', name: 'Planificación', color: 'green'}], assignedUsers: [{id: 'u1', initials: 'JD'}, {id: 'u3', initials: 'MR'}]},
];

const INITIAL_COLUMNS: { [key: string]: Column } = {
    todo: { id: 'todo', title: 'Por Hacer', tasks: [INITIAL_TASKS[0], INITIAL_TASKS[1], INITIAL_TASKS[2]] },
    inprogress: { id: 'inprogress', title: 'En Progreso', tasks: [INITIAL_TASKS[3], INITIAL_TASKS[4]] },
    review: { id: 'review', title: 'Revisión', tasks: [INITIAL_TASKS[5]] },
    done: { id: 'done', title: 'Completado', tasks: [INITIAL_TASKS[6]] },
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
};

const TaskCard: React.FC<{ task: Task; onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumnId: string) => void; columnId: string; onClick: () => void; }> = ({ task, onDragStart, columnId, onClick }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id, columnId)}
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm border-l-4 border-sky-500 dark:border-sky-400 mb-3 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{task.title}</h4>
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><i className="far fa-calendar"></i> {task.dueDate}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
        </div>
        <div className="flex justify-between items-center">
             <div className="flex gap-1">
                {task.labels.map(label => (
                    <span key={label.id} className={`text-xs font-medium px-2 py-0.5 rounded ${LABEL_STYLES[label.color]}`}>{label.name}</span>
                ))}
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

const TaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (task: Task) => void;
    onDelete: (taskId: string) => void;
}> = ({ isOpen, onClose, task, onSave, onDelete }) => {
    const [editedTask, setEditedTask] = useState<Task | null>(task);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    React.useEffect(() => {
        setEditedTask(task);
    }, [task]);

    if (!isOpen || !editedTask) return null;

    const handleSave = () => {
        onSave(editedTask);
        onClose();
    };
    
    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete(editedTask.id);
        setDeleteConfirmOpen(false);
        onClose();
    };

    const inputStyles = "w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors";
    const labelStyles = "font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <input type="text" value={editedTask.title} onChange={(e) => setEditedTask({...editedTask, title: e.target.value})} className="text-xl font-bold text-sky-900 dark:text-sky-300 bg-transparent border-none p-0 focus:ring-0 w-full" />
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-2xl">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                     <div>
                        <label className={labelStyles}>Descripción</label>
                        <textarea value={editedTask.description} onChange={(e) => setEditedTask({...editedTask, description: e.target.value})} className={`${inputStyles} min-h-[100px]`}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className={labelStyles}>Prioridad</label>
                            <select value={editedTask.priority} onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as Priority})} className={inputStyles}>
                                <option>Baja</option>
                                <option>Media</option>
                                <option>Alta</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelStyles}>Fecha Vencimiento</label>
                            <input type="date" value={editedTask.dueDate} onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})} className={`${inputStyles} dark:[color-scheme:dark]`} />
                        </div>
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
        </div>
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
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-sky-500" placeholder="Ej: Revisar informe de calidad" />
                    </div>
                     <div>
                        <label className="font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm">Prioridad</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-sky-500">
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
        
        const sourceColumn = newColumns[sourceColumnId];
        const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
        [taskToMove] = sourceColumn.tasks.splice(taskIndex, 1);

        const destinationColumn = newColumns[destinationColumnId];
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
            const taskIndex = newColumns[columnId].tasks.findIndex(t => t.id === updatedTask.id);
            if (taskIndex !== -1) {
                newColumns[columnId].tasks[taskIndex] = updatedTask;
                break;
            }
        }
        setColumns(newColumns);
    };
    
    const handleDeleteTask = (taskId: string) => {
        const newColumns = { ...columns };
        for (const columnId in newColumns) {
            newColumns[columnId].tasks = newColumns[columnId].tasks.filter(t => t.id !== taskId);
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