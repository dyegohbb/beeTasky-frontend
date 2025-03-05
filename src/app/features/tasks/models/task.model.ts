export interface UserDTO {
    identifier: string;
    name: string;
    email: string;
}

export interface TaskDTO {
    identifier: string;
    title: string;
    description: string;
    status: TaskStatusEnum;
    createdOn: Date;
    deadline: Date;
    assignedTo: UserDTO;
}

export enum TaskStatusEnum {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export interface TaskFilterDTO {
    identifier?: string | null;
    title?: string | null;
    status?: TaskStatusEnum | null;
    createdOnStartDate?: Date | null;
    createdOnEndDate?: Date | null;
    deadlineStartDate?: Date | null;
    deadlineEndDate?: Date | null;
}