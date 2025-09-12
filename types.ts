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

export type Priority = 'Baja' | 'Media' | 'Alta';

export interface UserAvatar {
    id: string;
    initials: string;
}

export interface Label {
    id: string;
    name: string;
    color: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'gray';
}

export interface Attachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string; // data URL
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
    labels: Label[];
    assignedUsers: UserAvatar[];
    attachments: Attachment[];
}

export interface Column {
    id: 'todo' | 'inprogress' | 'review' | 'done';
    title: string;
    tasks: Task[];
}
