import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventarioDetalle } from '../models/inventario-detalle';
import { InventarioConsolidado } from '../models/inventario-consolidado';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrlDetalle = 'https://www.carnesag.cl/nginventory/api/inventario-detalle.php';
  private apiUrlConsolidado = 'https://www.carnesag.cl/nginventory/api/inventario-consolidado.php';
  private apiUrlTemporal = 'https://www.carnesag.cl/nginventory/api/cargar_inventario_temporal.php'; // Corregido

  constructor(private http: HttpClient) { }

  // Obtener registros de inventario detalle
  getInventarioDetalle(): Observable<InventarioDetalle[]> {
    return this.http.get<InventarioDetalle[]>(this.apiUrlDetalle);
  }

  // Agregar un nuevo registro de inventario
  agregarInventarioDetalle(inventario: InventarioDetalle): Observable<{ success: boolean, data: InventarioDetalle }> {
    return this.http.post<{ success: boolean, data: InventarioDetalle }>(this.apiUrlDetalle, inventario);
  }

  // Consolidar el inventario
  consolidarInventario(mes: string): Observable<{ success: boolean, data: InventarioConsolidado[] }> {
    return this.http.post<{ success: boolean, data: InventarioConsolidado[] }>(this.apiUrlConsolidado, { mes });
  }

  // Guardar inventario temporal
  guardarInventarioTemporal(inventario: InventarioDetalle[]): Observable<{ success: boolean, message: string }> {
    return this.http.post<{ success: boolean, message: string }>(this.apiUrlTemporal, { inventario });
  }
}
