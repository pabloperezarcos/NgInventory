import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventarioDetalle } from '../models/inventario-detalle';
import { InventarioConsolidado } from '../models/inventario-consolidado';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrlTemporal = 'https://www.carnesag.cl/nginventory/api/obtener_inventario_temporal.php';
  private apiUrlDetalle = 'https://www.carnesag.cl/nginventory/api/cargar_inventario_detalle.php';
  private apiUrlConsolidado = 'https://www.carnesag.cl/nginventory/api/consolidar_inventario.php';


  constructor(private http: HttpClient) { }

  // Obtener registros de inventario detalle
  getInventarioDetalle(): Observable<InventarioDetalle[]> {
    return this.http.get<InventarioDetalle[]>(this.apiUrlDetalle);
  }

  // Agregar un nuevo registro de inventario
  agregarInventarioDetalle(inventario: InventarioDetalle): Observable<{ success: boolean, data: InventarioDetalle }> {
    return this.http.post<{ success: boolean, data: InventarioDetalle }>(this.apiUrlDetalle, inventario);
  }

  // Obtener los registros del inventario temporal
  getInventarioTemporal(): Observable<{ success: boolean; data: InventarioDetalle[] }> {
    return this.http.get<{ success: boolean; data: InventarioDetalle[] }>(
      'https://www.carnesag.cl/nginventory/api/obtener_inventario_temporal.php'
    );
  }

  // Guardar datos en inventario_detalle
  cargarInventarioDetalle(inventario: InventarioDetalle[]): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(this.apiUrlDetalle, { inventario });
  }

  // Consolidar inventario
  consolidarInventario(mesConsolidacion: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(this.apiUrlConsolidado, { mes_consolidacion: mesConsolidacion });
  }

  // Guardar inventario temporal
  guardarInventarioTemporal(inventario: InventarioDetalle[]): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      'https://www.carnesag.cl/nginventory/api/cargar_inventario_temporal.php',
      { inventario }
    );
  }

}
