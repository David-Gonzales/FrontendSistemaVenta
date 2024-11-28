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

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    { path:'dashboard', component:DashBoardComponent },
    { path:'usuarios', component:UsuarioComponent },
    { path:'productos', component:ProductoComponent },
    { path:'inventario', component:InventarioComponent},
    { path:'venta', component:VentaComponent },
    { path:'historial-venta', component:HistorialVentaComponent },
    { path:'clientes', component:ClienteComponent },
    { path:'reportes', component:ReporteComponent },

  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
