export interface Empleado {
    id?: string;
    nombre: string;
    apellido: string;
    dni: string;
    salario: number;
    fechaCreacion?: Date;
    fechaActualizacion: Date;
}
