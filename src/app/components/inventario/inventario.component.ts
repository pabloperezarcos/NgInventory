import { Component } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { InventarioDetalle } from '../../models/inventario-detalle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: string = '';
  cantidadCajas: number = 0;
  cantidadKilos: number = 0;
  pesoCajas: number = 0;
  listaInventario: InventarioDetalle[] = [];

  constructor(
    private productosService: ProductosService,
    private inventarioService: InventarioService
  ) { }

  ngOnInit() {
    this.cargarProductos();
    this.cargarDesdeLocalStorage();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (response: any[]) => {
        if (Array.isArray(response)) {
          this.productos = response.map((p: any) => ({
            id_existencia: Number(p.ID_EXISTENCIA), // Convertir a número
            nombre: p.NOMBRE as string,
            unidad: p.UNIDAD as string,
            categoria_id: Number(p.CATEGORIA_ID_CATEGORIA), // Convertir a número
            categoria_nombre: p.CATEGORIA_NOMBRE as string,
            activoParaVenta: p.ACTIVOPARAVENTA as string
          }));
        } else {
          /* console.error("Formato de respuesta incorrecto:", response); */
          this.productos = [];
        }
        /* console.log("Productos cargados:", this.productos); */
      },
      error: (error) => {
        console.error("Error al cargar productos:", error);
        this.productos = [];
      },
      complete: () => {
        /* console.log("Carga de productos completada."); */
      }
    });
  }

  filtrarProductos() {
    if (!this.productoSeleccionado) {
      this.productosFiltrados = [];
      return;
    }

    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(this.productoSeleccionado.toLowerCase())
    );

    /* console.log("Productos filtrados:", this.productosFiltrados); */
  }



  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto.nombre;
    this.productosFiltrados = [];
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidadKilos <= 0) {
      alert('El campo de Kilos debe tener un valor válido mayor a 0.');
      return;
    }

    const productoEncontrado = this.productos.find(p => p.nombre === this.productoSeleccionado);
    if (!productoEncontrado) {
      alert('Selecciona un producto válido.');
      return;
    }

    const nuevoItem: InventarioDetalle = {
      existencia_id: productoEncontrado.id_existencia,
      nombre: productoEncontrado.nombre,
      categoria_id: productoEncontrado.categoria_id,
      categoria_nombre: productoEncontrado.categoria_nombre,
      cantidad_cajas: this.cantidadCajas,
      cantidad_kilos: this.cantidadKilos,
      peso_cajas: this.pesoCajas,
      usuario: 'Admin'
    };

    this.listaInventario.unshift(nuevoItem);
    this.guardarEnLocalStorage(); // Guardar en localStorage

    // Reiniciar los campos del formulario
    this.productoSeleccionado = '';
    this.cantidadCajas = 0;
    this.cantidadKilos = 0;
    this.pesoCajas = 0;
  }

  // Guardar la lista de productos en el localStorage
  guardarEnLocalStorage() {
    localStorage.setItem('listaInventario', JSON.stringify(this.listaInventario));
  }

  // Cargar la lista de productos desde el localStorage
  cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem('listaInventario');
    if (datosGuardados) {
      this.listaInventario = JSON.parse(datosGuardados);
    }
  }


  // Eliminar producto y actualizar el localStorage
  eliminarProducto(item: InventarioDetalle) {
    this.listaInventario = this.listaInventario.filter(i => i !== item);
    this.guardarEnLocalStorage(); // Guardar cambios en localStorage
  }

  // Limpiar `localStorage` cuando se finaliza el inventario
  finalizarInventario() {
    localStorage.removeItem('listaInventario');
    this.listaInventario = [];
    alert("Inventario finalizado y datos limpiados.");
  }


  cargarBaseDatos() {
    if (this.listaInventario.length === 0) {
      alert("No hay productos para cargar.");
      return;
    }

    if (!confirm("¿Estás seguro de que deseas cargar el inventario a la base de datos? Esta acción no se puede deshacer.")) {
      return;
    }

    this.inventarioService.guardarInventarioTemporal(this.listaInventario).subscribe(response => {
      if (response.success) {
        alert("Inventario cargado con éxito.");

        // 🔹 Primero verificar que la base de datos realmente guardó los datos
        console.log("Inventario cargado:", this.listaInventario);

        // 🔹 Ahora limpiamos solo si se guardó correctamente en la BD
        this.listaInventario = [];
        localStorage.removeItem('listaInventario'); // 🔹 CORREGIDO: Eliminamos la clave correcta

      } else {
        alert("Error al cargar el inventario: " + response.message);
        console.error("Error en la respuesta:", response);
      }
    }, error => {
      console.error("Error en la carga del inventario:", error);
      alert("Hubo un problema al cargar el inventario. Revisa la consola.");
    });
  }





}
