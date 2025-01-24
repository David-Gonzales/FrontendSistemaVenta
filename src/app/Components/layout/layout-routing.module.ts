import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { InventarioComponent } from './Pages/inventario/inventario.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { EntradaComponent } from './Pages/inventario/entrada/entrada.component';
import { SalidaComponent } from './Pages/inventario/salida/salida.component';
import { LoginGuard } from '../../guards/login.guard';
import { MenuGuard } from '../../guards/menu.guard';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    { path:'dashboard', component:DashBoardComponent, canActivate: [LoginGuard] },
    { path:'usuarios', component:UsuarioComponent, canActivate: [LoginGuard, MenuGuard] },
    { path:'productos', component:ProductoComponent, canActivate: [LoginGuard, MenuGuard] },
    {
      path:'inventario',
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: InventarioComponent,  // O el componente que maneje la lista de entradas y salidas
        },
        {
          path: 'entrada',
          component: EntradaComponent,   // Este es el componente para la entrada
        },
        {
          path: 'salida',
          component: SalidaComponent,    // Este es el componente para la salida
        },
      ],
      canActivate: [LoginGuard]
    },
    { path:'venta', component:VentaComponent, canActivate: [LoginGuard, MenuGuard] },
    { path:'historial-venta', component:HistorialVentaComponent, canActivate: [LoginGuard, MenuGuard] },
    { path:'clientes', component:ClienteComponent, canActivate: [LoginGuard, MenuGuard] },
    { path:'reportes', component:ReporteComponent, canActivate: [LoginGuard, MenuGuard] },

  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
