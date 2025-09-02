
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
    url?: string;
}

export interface InspectionData {
    id: string;
    fecha: string;
    areaProceso: string;
    op: string;
    disenoReferencia: string;
    estado: string;
    defecto: string;
    registro: string;
    responsable: string;
    observacion: string;
    photo?: string;
}