export type Rol = 'cliente' | 'empleado' | 'admin';

export interface PerfilModel {
    id: string;              
    nombre: string | null;
    apellido: string | null;
    fechaNacimiento: string | null;
    rol: Rol;
    puntos: number;
    credito: number;
    tipoSangre: string | null;
    colorOjos: string | null;
    diasVacaciones: number | null;
}