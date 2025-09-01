
export interface User {
    id: string;
    email: string;
    username: string;
    role: string;
    password?: string;
}

export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: React.FC;
    children?: NavItem[];
}

export interface Document {
    id: number;
    name: string;
    type: string;
    date: string;
    size: string;
}

export interface InspectionData {
    inspectionDate: string;
    inspectorName: string;
    productCode: string;
    batchNumber: string;
    measurementOne?: number | null;
    measurementTwo?: number | null;
    status: 'aprobado' | 'rechazado' | 'pendiente' | '';
    defectType?: 'dimensional' | 'visual' | 'funcional' | 'otro' | '';
    observations: string;
}
