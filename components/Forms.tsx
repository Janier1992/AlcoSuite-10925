
import React, { useState, useEffect, useRef } from 'react';
import type { InspectionData } from '../types';
import Breadcrumbs from './Breadcrumbs';
import { AREAS_PROCESO, ESTADO_OPTIONS, DEFECTO_TYPES, REGISTRO_USERS, EditIcon, DeleteIcon, CameraIcon } from '../constants';

const INITIAL_FORM_DATA: Omit<InspectionData, 'id'> = {
    fecha: '',
    areaProceso: '',
    op: '',
    disenoReferencia: '',
    estado: '',
    defecto: 'Ninguno',
    registro: '',
    responsable: '',
    observacion: '',
    photo: ''
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

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
                    <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300">Capturar Evidencia</h2>
                </div>
                <div className="p-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-md"></video>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t dark:border-slate-700">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleCapture} type="button" className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors flex items-center gap-2">
                        <CameraIcon /> Capturar Foto
                    </button>
                </div>
            </div>
        </div>
    );
};


const Forms: React.FC = () => {
    const DRAFT_KEY = 'inspectionFormDraft_v6';
    const [formData, setFormData] = useState<Omit<InspectionData, 'id'>>(INITIAL_FORM_DATA);
    const [submissions, setSubmissions] = useState<InspectionData[]>([]);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCameraOpen, setCameraOpen] = useState(false);
    const [currentInspection, setCurrentInspection] = useState<InspectionData | null>(null);

    useEffect(() => {
        // You could load initial submissions from an API here
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(newFormData));
    };
    
    const loadDraft = () => {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
          if (window.confirm("Se encontró un borrador guardado. ¿Desea cargarlo?")) {
              setFormData(JSON.parse(draft));
          }
      } else {
          alert("No se encontró ningún borrador.");
      }
    };
    
    const handleCapturePhoto = (imageSrc: string) => {
        const newFormData = { ...formData, photo: imageSrc };
        setFormData(newFormData);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(newFormData));
        setCameraOpen(false);
    };

    const handleClearPhoto = () => {
        const newFormData = { ...formData, photo: '' };
        setFormData(newFormData);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(newFormData));
    };

    const clearForm = () => {
        setFormData(INITIAL_FORM_DATA);
        localStorage.removeItem(DRAFT_KEY);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSubmission: InspectionData = {
            id: Date.now().toString(),
            ...formData
        };
        setSubmissions(prev => [newSubmission, ...prev]);
        clearForm();
    };
    
    const handleOpenEditModal = (inspection: InspectionData) => {
        setCurrentInspection(inspection);
        setEditModalOpen(true);
    };
    
    const handleOpenDeleteModal = (inspection: InspectionData) => {
        setCurrentInspection(inspection);
        setDeleteModalOpen(true);
    };

    const handleUpdateSubmission = (updatedInspection: InspectionData) => {
        setSubmissions(prev => prev.map(sub => sub.id === updatedInspection.id ? updatedInspection : sub));
        setEditModalOpen(false);
        setCurrentInspection(null);
    };
    
    const handleDeleteSubmission = () => {
        if (currentInspection) {
            setSubmissions(prev => prev.filter(sub => sub.id !== currentInspection.id));
            setDeleteModalOpen(false);
            setCurrentInspection(null);
        }
    };

    const inputStyles = "w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors";
    const labelStyles = "font-medium text-slate-600 dark:text-slate-400 block mb-1 text-sm";
    
    const renderStatusBadge = (status: string) => (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'Aprobado' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
          status === 'Rechazado' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
        {status}
      </span>
    );
    
    const EditForm: React.FC<{ inspection: InspectionData, onSave: (data: InspectionData) => void, onCancel: () => void }> = ({ inspection, onSave, onCancel }) => {
        const [editData, setEditData] = useState(inspection);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            setEditData({ ...editData, [e.target.name]: e.target.value });
        };
        
        const handleSave = () => onSave(editData);
        
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                    <div><label htmlFor="edit_fecha" className={labelStyles}>Fecha:</label><input type="date" id="edit_fecha" name="fecha" value={editData.fecha} onChange={handleChange} required className={`${inputStyles} dark:[color-scheme:dark]`} /></div>
                    <div><label htmlFor="edit_areaProceso" className={labelStyles}>Área/Proceso:</label><select id="edit_areaProceso" name="areaProceso" value={editData.areaProceso} onChange={handleChange} required className={inputStyles}><option value="">Seleccione</option>{AREAS_PROCESO.map(area => <option key={area} value={area}>{area}</option>)}</select></div>
                    <div><label htmlFor="edit_op" className={labelStyles}>Op:</label><input type="text" id="edit_op" name="op" value={editData.op} onChange={handleChange} required className={inputStyles} /></div>
                    <div><label htmlFor="edit_disenoReferencia" className={labelStyles}>Diseño/Referencia:</label><input type="text" id="edit_disenoReferencia" name="disenoReferencia" value={editData.disenoReferencia} onChange={handleChange} required className={inputStyles} /></div>
                    <div><label htmlFor="edit_estado" className={labelStyles}>Estado:</label><select id="edit_estado" name="estado" value={editData.estado} onChange={handleChange} required className={inputStyles}><option value="">Seleccione</option>{ESTADO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                    <div><label htmlFor="edit_defecto" className={labelStyles}>Defecto:</label><select id="edit_defecto" name="defecto" value={editData.defecto} onChange={handleChange} required className={inputStyles}>{DEFECTO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
                    <div><label htmlFor="edit_registro" className={labelStyles}>Registro:</label><select id="edit_registro" name="registro" value={editData.registro} onChange={handleChange} required className={inputStyles}><option value="">Seleccione</option>{REGISTRO_USERS.map(user => <option key={user} value={user}>{user}</option>)}</select></div>
                    <div><label htmlFor="edit_responsable" className={labelStyles}>Responsable:</label><input type="text" id="edit_responsable" name="responsable" value={editData.responsable} onChange={handleChange} required className={inputStyles} /></div>
                    <div className="md:col-span-2 lg:col-span-4"><label htmlFor="edit_observacion" className={labelStyles}>Observación:</label><textarea id="edit_observacion" name="observacion" value={editData.observacion} onChange={handleChange} className={`${inputStyles} min-h-[80px]`}></textarea></div>
                </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onCancel} type="button" className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSave} type="button" className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition-colors">Guardar Cambios</button>
                </div>
            </div>
        );
    }

    return (
      <>
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <div className="mb-6">
                <Breadcrumbs crumbs={[{ label: 'Calidad', path: '/quality/forms' }, { label: 'Formularios' }]} />
                <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-300 mt-2">Formulario de Inspección de Calidad</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <fieldset className="border dark:border-slate-600 p-4 rounded-md">
                    <legend className="text-lg font-semibold text-slate-700 dark:text-slate-300 px-2">Información General</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 pt-2">
                        <div><label htmlFor="fecha" className={labelStyles}>Fecha:</label><input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} required className={`${inputStyles} dark:[color-scheme:dark]`} /></div>
                        <div><label htmlFor="areaProceso" className={labelStyles}>Área/Proceso:</label><select id="areaProceso" name="areaProceso" value={formData.areaProceso} onChange={handleInputChange} required className={inputStyles}><option value="">Seleccione</option>{AREAS_PROCESO.map(area => <option key={area} value={area}>{area}</option>)}</select></div>
                        <div><label htmlFor="op" className={labelStyles}>Op:</label><input type="text" id="op" name="op" value={formData.op} onChange={handleInputChange} required className={inputStyles} /></div>
                        <div><label htmlFor="disenoReferencia" className={labelStyles}>Diseño/Referencia:</label><input type="text" id="disenoReferencia" name="disenoReferencia" value={formData.disenoReferencia} onChange={handleInputChange} required className={inputStyles} /></div>
                        <div><label htmlFor="estado" className={labelStyles}>Estado:</label><select id="estado" name="estado" value={formData.estado} onChange={handleInputChange} required className={inputStyles}><option value="">Seleccione</option>{ESTADO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                        <div><label htmlFor="defecto" className={labelStyles}>Defecto:</label><select id="defecto" name="defecto" value={formData.defecto} onChange={handleInputChange} required className={inputStyles}>{DEFECTO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
                        <div><label htmlFor="registro" className={labelStyles}>Registro:</label><select id="registro" name="registro" value={formData.registro} onChange={handleInputChange} required className={inputStyles}><option value="">Seleccione</option>{REGISTRO_USERS.map(user => <option key={user} value={user}>{user}</option>)}</select></div>
                        <div><label htmlFor="responsable" className={labelStyles}>Responsable:</label><input type="text" id="responsable" name="responsable" value={formData.responsable} onChange={handleInputChange} required className={inputStyles} /></div>
                        <div className="md:col-span-2 lg:col-span-4"><label htmlFor="observacion" className={labelStyles}>Observación:</label><textarea id="observacion" name="observacion" value={formData.observacion} onChange={handleInputChange} className={`${inputStyles} min-h-[80px]`}></textarea></div>
                        <div className="md:col-span-2 lg:col-span-4">
                            <label className={labelStyles}>Evidencia Fotográfica:</label>
                            <div className="mt-1 flex items-center gap-4 p-2 border border-gray-300 dark:border-slate-600 rounded-md min-h-[104px]">
                                {formData.photo ? (
                                    <div className="relative">
                                        <img src={formData.photo} alt="Evidencia" className="h-20 w-20 object-cover rounded-md" />
                                        <button type="button" onClick={handleClearPhoto} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition-colors" title="Eliminar foto">&times;</button>
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-400 text-sm">Sin Foto</div>
                                )}
                                <button type="button" onClick={() => setCameraOpen(true)} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm font-semibold">
                                    <CameraIcon /> <span>Abrir Cámara</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
                    <button type="button" onClick={loadDraft} className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">Rest. Borrador</button>
                    <button type="button" onClick={() => { if(window.confirm('¿Está seguro de que desea cancelar y limpiar el formulario?')) clearForm(); }} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Cancelar</button>
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-sky-900 dark:bg-sky-700 text-white rounded-md hover:bg-sky-800 dark:hover:bg-sky-600 transition-colors font-semibold">Guardar Inspección</button>
                </div>
            </form>
        </div>
        <div className="mt-8 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Envíos Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="p-3">Fecha</th>
                    <th scope="col" className="p-3">Área</th>
                    <th scope="col" className="p-3">Op</th>
                    <th scope="col" className="p-3">Referencia</th>
                    <th scope="col" className="p-3">Estado</th>
                    <th scope="col" className="p-3">Defecto</th>
                    <th scope="col" className="p-3">Registro</th>
                    <th scope="col" className="p-3">Responsable</th>
                    <th scope="col" className="p-3">Observación</th>
                    <th scope="col" className="p-3">Evidencia</th>
                    <th scope="col" className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length > 0 ? submissions.map(sub => (
                    <tr key={sub.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-3">{sub.fecha}</td>
                      <td className="p-3">{sub.areaProceso}</td>
                      <td className="p-3">{sub.op}</td>
                      <td className="p-3">{sub.disenoReferencia}</td>
                      <td className="p-3">{renderStatusBadge(sub.estado)}</td>
                      <td className="p-3">{sub.defecto}</td>
                      <td className="p-3">{sub.registro}</td>
                      <td className="p-3">{sub.responsable}</td>
                      <td className="p-3 truncate max-w-[150px]" title={sub.observacion}>{sub.observacion}</td>
                      <td className="p-3">
                        {sub.photo ? (
                            <a href={sub.photo} target="_blank" rel="noopener noreferrer">
                                <img src={sub.photo} alt="Evidencia" className="h-10 w-10 object-cover rounded-md hover:scale-110 transition-transform" />
                            </a>
                        ) : (
                            <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="p-3">
                         <div className="flex gap-2">
                           <button onClick={() => handleOpenEditModal(sub)} className="p-2 rounded-full text-sky-600 hover:bg-sky-100 hover:text-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/50 dark:hover:text-sky-300 transition-colors" title="Editar"><EditIcon /></button>
                           <button onClick={() => handleOpenDeleteModal(sub)} className="p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300 transition-colors" title="Eliminar"><DeleteIcon /></button>
                         </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan={11} className="text-center p-4 text-slate-500 dark:text-slate-400">No hay envíos recientes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>

        <CameraModal isOpen={isCameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleCapturePhoto} />

        {currentInspection && (
            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Inspección">
                <EditForm inspection={currentInspection} onSave={handleUpdateSubmission} onCancel={() => setEditModalOpen(false)} />
            </Modal>
        )}
        
        <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirmar Eliminación">
            <p className="text-slate-600 dark:text-slate-300">¿Está seguro de que desea eliminar este registro de inspección? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                 <button onClick={handleDeleteSubmission} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
        </Modal>

      </>
    );
};

export default Forms;