export interface InventarioDetalle {
    id?: number;
    existencia_id: number;
    nombre: string; // Nuevo campo para mostrar el nombre en la tabla
    categoria_id: number;
    categoria_nombre: string; // Nuevo campo para mostrar la categoría en la tabla
    cantidad_cajas: number;
    cantidad_kilos: number;
    peso_cajas: number;
    fecha_ingreso?: string;
    usuario: string;
}
