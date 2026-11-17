export interface ListaEsperaModel {
    id: number;
    funcionId: number;
    peliculaId: number;
    pelicula: string;
    fechaHoraInicio: string;
    formato: string;
    estado: 'esperando' | 'notificado';
    posicion: number;                
    butacaId: number | null;
    turnoVenceAt: number | null;     
}

export interface ListaEsperaAdminModel {
    funcionId: number;
    pelicula: string;
    sala: string;
    fechaHoraInicio: string;
    formato: string;
    esperando: number;
    conTurno: number;
}

export interface TurnoTomado {
    butacaId: number;
    segundos: number;
}

export interface UsuarioRow {
    id: number;
    funcion_id: number; 
    pelicula_id: number; 
    pelicula: string;
    fecha_hora_inicio: string; 
    formato: string; estado: 'esperando' | 'notificado';
    posicion: number; 
    butaca_id: number | null; 
    turno_vence_at: string | null;
}

export interface AdminRow {
    funcion_id: number; 
    pelicula: string; 
    sala: string; 
    fecha_hora_inicio: string;
    formato: string; 
    esperando: number; 
    con_turno: number;
}