import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface InventarioResponse {
  success: boolean;
  data: any[];
  message?: string; // Se agrega message opcionalmente
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaInventarioService {
  private apiUrlDetalle = 'https://www.carnesag.cl/nginventory/api/obtener_inventario_detalle.php';
  private apiUrlConsolidado = 'https://www.carnesag.cl/nginventory/api/obtener_inventario_consolidado.php';

  constructor(private http: HttpClient) { }

  // Obtener Inventario Detalle
  getInventarioDetalle(): Observable<InventarioResponse> {
    return this.http.get<InventarioResponse>(this.apiUrlDetalle);
  }

  // Obtener Inventario Consolidado
  getInventarioConsolidado(): Observable<InventarioResponse> {
    return this.http.get<InventarioResponse>(this.apiUrlConsolidado);
  }

  
}