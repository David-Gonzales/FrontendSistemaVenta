import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ValidarLoginGuard } from './guards/validar-login.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent,pathMatch:"full" },
  { path: 'login', component: LoginComponent,pathMatch:"full", canActivate: [ValidarLoginGuard] },
  { path: 'pages', loadChildren:() => import("./Components/layout/layout.module").then(m => m.LayoutModule) }, //Carga perezosa de todas las páginas
  { path: '**', redirectTo:'login', pathMatch:"full"},
  { path: '#', redirectTo: 'pages', pathMatch: 'full' } // Ruta para ignorar el hash
];
