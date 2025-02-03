import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/inventario/inventario.component').then(c => c.InventarioComponent),
        data: { showNavbar: false, showFooter: false }
    },
    {
        path: 'inventario',
        loadComponent: () => import('./components/inventario/inventario.component').then(c => c.InventarioComponent),
        data: { showNavbar: false, showFooter: false }
    },
    {
        path: 'consolidar-inventario',
        loadComponent: () => import('./components/consolidar-inventario/consolidar-inventario.component').then(c => c.ConsolidarInventarioComponent),
        data: { showNavbar: false, showFooter: false }
    },
    {
        path: 'consultar-inventario',
        loadComponent: () => import('./components/consultar-inventario/consultar-inventario.component').then(c => c.ConsultarInventarioComponent),
        data: { showNavbar: false, showFooter: false }
    }



];
