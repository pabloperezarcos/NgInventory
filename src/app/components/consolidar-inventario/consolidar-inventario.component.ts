import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { InventarioService } from '../../services/inventario.service';
import { InventarioDetalle } from '../../models/inventario-detalle';

@Component({
  selector: 'app-consolidar-inventario',
  imports: [CommonModule],
  templateUrl: './consolidar-inventario.component.html',
  styleUrl: './consolidar-inventario.component.scss'
})
export class ConsolidarInventarioComponent implements OnInit {
  inventarioTemporal: InventarioDetalle[] = [];

  constructor(private inventarioService: InventarioService) { }

  ngOnInit() {
    this.cargarInventarioTemporal();
  }

  cargarInventarioTemporal() {
    this.inventarioService.getInventarioTemporal()
      .pipe(
        tap(response => {
          if (response && response.success && Array.isArray(response.data)) {
            this.inventarioTemporal = response.data;
            console.log("Inventario Temporal:", this.inventarioTemporal);
          } else {
            console.error("Error: Respuesta inválida de la API", response);
            this.inventarioTemporal = [];
          }
        }),
        catchError(error => {
          console.error("Error en la solicitud:", error);
          return of({ success: false, data: [] }); // Retorna un objeto válido en caso de error
        })
      )
      .subscribe();
  }

  // Método que se ejecuta al presionar el botón
  confirmarConsolidacion() {
    const confirmacion = confirm("¿Estás seguro de que deseas consolidar el inventario?");

    if (!confirmacion) {
      console.log("Consolidación cancelada");
      return;
    }

    console.log("Consolidación confirmada");

    // 1️⃣ Guardar todos los datos en `inventario_detalle`
    this.inventarioService.cargarInventarioDetalle(this.inventarioTemporal).subscribe(response => {
      if (response.success) {
        console.log("Inventario guardado en detalle. Procediendo a consolidar...");

        // 2️⃣ Consolidar los datos en `inventario_consolidado`
        const mesConsolidacion = new Date().toISOString().slice(0, 7); // YYYY-MM
        this.inventarioService.consolidarInventario(mesConsolidacion).subscribe(responseConsolidacion => {
          if (responseConsolidacion.success) {
            alert("Inventario consolidado con éxito.");

            // 3️⃣ Vaciar la lista en el frontend
            this.inventarioTemporal = [];

          } else {
            alert("Error al consolidar: " + responseConsolidacion.message);
          }
        }, error => {
          console.error("Error en consolidación:", error);
        });

      } else {
        alert("Error al guardar en inventario detalle: " + response.message);
      }
    }, error => {
      console.error("Error al guardar en detalle:", error);
    });
  }
}

