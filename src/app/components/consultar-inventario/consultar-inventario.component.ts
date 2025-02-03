import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaInventarioService } from '../../services/consultar-inventario.service';


@Component({
  selector: 'app-consultar-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-inventario.component.html',
  styleUrl: './consultar-inventario.component.scss'
})
export class ConsultarInventarioComponent implements OnInit {
  inventario: any[] = [];
  tablaSeleccionada: string = 'detalle'; // 'detalle' o 'consolidado'

  constructor(private consultaInventarioService: ConsultaInventarioService) { }

  ngOnInit() {
    this.consultarInventario();
  }

  consultarInventario() {
    if (this.tablaSeleccionada === 'detalle') {
      this.consultaInventarioService.getInventarioDetalle().subscribe(response => {
        if (response.success) {
          this.inventario = response.data;
        } else {
          console.error("Error al obtener inventario detalle:", response.message);
          this.inventario = [];
        }
      });
    } else {
      this.consultaInventarioService.getInventarioConsolidado().subscribe(response => {
        if (response.success) {
          this.inventario = response.data;
        } else {
          console.error("Error al obtener inventario consolidado:", response.message);
          this.inventario = [];
        }
      });
    }
  }
}