export interface InventarioConsolidado {
    id?: number;
    existencia_id: number;
    total_cajas: number;
    total_kilos: number;
    total_peso: number;
    fecha_consolidacion?: string;
    usuario: string;
    mes_consolidacion: string;
    version: number;
    activo: boolean;
}
