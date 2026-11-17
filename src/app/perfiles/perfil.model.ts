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

export interface PerfilRow {
    id: string;
    nombre: string | null;
    apellido: string | null;
    fecha_nacimiento: string | null;
    rol: Rol;
    puntos: number;
    credito: number;
    tipo_sangre: string | null;
    color_ojos: string | null;
    dias_vacaciones: number | null;
}