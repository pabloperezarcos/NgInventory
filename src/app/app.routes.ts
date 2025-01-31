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


];
