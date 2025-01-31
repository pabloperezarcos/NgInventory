export interface Producto {
    id_existencia: number;
    nombre: string;
    unidad: string;
    categoria_id: number;
    categoria_nombre: string; 
    activoParaVenta: string; // 'Si' o 'No'
}
