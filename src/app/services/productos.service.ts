import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://www.carnesag.cl/nginventory/api/productos.php';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<{ success: boolean; data: Producto[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}
