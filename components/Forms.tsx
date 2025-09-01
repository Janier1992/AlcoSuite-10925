import React, { useState, useEffect } from 'react';
import type { InspectionData } from '../types';
import Breadcrumbs from './Breadcrumbs';

const MOCK_SUBMISSIONS: (InspectionData & { id: number })[] = [
    { id: 1, inspectionDate: '2024-07-20', inspectorName: 'Inspector', productCode: 'P-102A', batchNumber: 'L582', status: 'aprobado', observations: 'Todo conforme.' },
    { id: 2, inspectionDate: '2024-07-20', inspectorName: 'Inspector', productCode: 'P-103B', batchNumber: 'L583', status: 'rechazado', defectType: 'dimensional', observations: 'Fuera de tolerancia.' },
    { id: 3, inspectionDate: '2024-07-19', inspectorName: 'Inspector', productCode: 'P-102A', batchNumber: 'L580', status: 'aprobado', observations: 'OK.' },
];

const Forms: React.FC = () => {
    const DRAFT_KEY = 'inspectionFormDraft_v4';
    // FIX: Initialize number fields with null instead of empty string to match InspectionData type.
    const [formData, setFormData] = useState<Omit<InspectionData, 'status' | 'defectType'> & { status: string; defectType: string }>({
        inspectionDate: '',
        inspectorName: '',
        productCode: '',
        batchNumber: '',
        measurementOne: null,
        measurementTwo: null,
        status: '',
        defectType: '',
        observations: ''
    });

    useEffect(() => {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            console.log("Draft found");
        }
    }, []);

    // FIX: Handle parsing for number inputs to store correct data type in state.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let newFormData;
        if (name === 'measurementOne' || name === 'measurementTwo') {
            // For number inputs, parse to float or set to null if empty.
            newFormData = { ...formData, [name]: value === '' ? null : parseFloat(value) };
        } else {
            newFormData = { ...formData, [name]: value };
        }
        
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

    // FIX: Reset number fields to null instead of empty string.
    const clearForm = () => {
        setFormData({
            inspectionDate: '',
            inspectorName: '',
            productCode: '',
            batchNumber: '',
            measurementOne: null,
            measurementTwo: null,
            status: '',
            defectType: '',
            observations: ''
        });
        localStorage.removeItem(DRAFT_KEY);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Formulario guardado (simulación).\n' + JSON.stringify(formData, null, 2));
        clearForm();
    };
    
    const inputStyles = "w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none";
    const labelStyles = "font-medium text-slate-600 dark:text-slate-400 block mb-1";


    return (
      <>
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <div className="mb-6">
                <Breadcrumbs crumbs={[{ label: 'Calidad', path: '/quality/forms' }, { label: 'Formularios' }]} />
                <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-300 mt-2">Formulario de Inspección de Calidad</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <fieldset className="mb-6 border dark:border-slate-600 p-4 rounded-md">
                    <legend className="text-lg font-semibold text-slate-700 dark:text-slate-300 px-2">Información General</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                        <div><label htmlFor="inspectionDate" className={labelStyles}>Fecha Inspección:</label><input type="date" id="inspectionDate" name="inspectionDate" value={formData.inspectionDate} onChange={handleInputChange} required className={`${inputStyles} dark:[color-scheme:dark]`} /></div>
                        <div><label htmlFor="inspectorName" className={labelStyles}>Inspector:</label><input type="text" id="inspectorName" name="inspectorName" value={formData.inspectorName} onChange={handleInputChange} required className={inputStyles} /></div>
                        <div><label htmlFor="productCode" className={labelStyles}>Cód. Producto:</label><input type="text" id="productCode" name="productCode" value={formData.productCode} onChange={handleInputChange} required pattern="^[A-Z0-9]{5,10}$" title="Código: 5-10 caracteres alfanuméricos (A-Z, 0-9)." className={inputStyles} /></div>
                        <div><label htmlFor="batchNumber" className={labelStyles}>Nº Lote:</label><input type="text" id="batchNumber" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} required className={inputStyles} /></div>
                    </div>
                </fieldset>
                
                <fieldset className="mb-6 border dark:border-slate-600 p-4 rounded-md">
                    <legend className="text-lg font-semibold text-slate-700 dark:text-slate-300 px-2">Mediciones y Evaluación</legend>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                        {/* FIX: Use nullish coalescing operator to handle null value for the input, preventing React warnings. */}
                        <div><label htmlFor="measurementOne" className={labelStyles}>Medida 1 (mm):</label><input type="number" id="measurementOne" name="measurementOne" value={formData.measurementOne ?? ''} onChange={handleInputChange} step="0.01" min="0" className={inputStyles} /></div>
                        {/* FIX: Use nullish coalescing operator to handle null value for the input, preventing React warnings. */}
                        <div><label htmlFor="measurementTwo" className={labelStyles}>Medida 2 (mm):</label><input type="number" id="measurementTwo" name="measurementTwo" value={formData.measurementTwo ?? ''} onChange={handleInputChange} step="0.01" min="0" className={inputStyles} /></div>
                        <div><label htmlFor="status" className={labelStyles}>Estado:</label><select id="status" name="status" value={formData.status} onChange={handleInputChange} required className={inputStyles}><option value="">Seleccione</option><option value="aprobado">Aprobado</option><option value="rechazado">Rechazado</option><option value="pendiente">Pendiente</option></select></div>
                        <div><label htmlFor="defectType" className={labelStyles}>Tipo Defecto:</label><select id="defectType" name="defectType" value={formData.defectType} onChange={handleInputChange} className={inputStyles}><option value="">Ninguno</option><option value="dimensional">Dimensional</option><option value="visual">Visual</option><option value="funcional">Funcional</option><option value="otro">Otro</option></select></div>
                         <div className="md:col-span-2"><label htmlFor="observations" className={labelStyles}>Observaciones:</label><textarea id="observations" name="observations" value={formData.observations} onChange={handleInputChange} className={`${inputStyles} min-h-[100px]`}></textarea></div>
                     </div>
                </fieldset>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4">
                    <button type="button" onClick={loadDraft} className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">Rest. Borrador</button>
                    <button type="button" onClick={() => { if(window.confirm('¿Está seguro de que desea cancelar y limpiar el formulario?')) clearForm(); }} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Cancelar</button>
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-sky-900 dark:bg-sky-700 text-white rounded-md hover:bg-sky-800 dark:hover:bg-sky-600 transition-colors font-semibold">Guardar Inspección</button>
                </div>
            </form>
        </div>
        <div className="mt-8 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-sky-900 dark:text-sky-300 mb-4">Envíos Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-700">
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Fecha</th>
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Cód. Producto</th>
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Nº Lote</th>
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Estado</th>
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SUBMISSIONS.map(sub => (
                    <tr key={sub.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <td className="p-3">{sub.inspectionDate}</td>
                      <td className="p-3">{sub.productCode}</td>
                      <td className="p-3">{sub.batchNumber}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sub.status === 'aprobado' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="p-2 text-sm text-sky-700 dark:text-sky-400 hover:underline">Ver Detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </>
    );
};

export default Forms;