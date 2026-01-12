export interface Task {
    id: string;
    title: string;
    description?: string;
}

export interface Column {
    name: string;
    tasks: Task[];
    id: string;
}

export interface SubTasks {
    title: string;
    isCompleted: boolean;
    id: string;
}