export interface Alert {
    type: AlertType;
    id: number;
    message: string;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}