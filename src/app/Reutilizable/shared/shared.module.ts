import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//============== COMPONENTES DE ANGULAR MATERIAL ==============//
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

//________________ Contenedores de Menú ______________________
//Diseño Responsivo y adaptativo
import { LayoutModule } from '@angular/cdk/layout';
//Creación de barra de herramientas (ej: menú hamburguesa)
import { MatToolbarModule } from '@angular/material/toolbar';
//Creación de un panel lateral (generalmente a la izquierda)
import { MatSidenavModule } from '@angular/material/sidenav';
//Botones
import { MatButtonModule } from '@angular/material/button';
//Iconos
import { MatIconModule } from '@angular/material/icon';
//Listas
import { MatListModule } from '@angular/material/list';
//Tablas
import { MatTableModule } from '@angular/material/table';
//Paginación
import { MatPaginatorModule } from '@angular/material/paginator';
//Modales de diálogo
import { MatDialogModule } from '@angular/material/dialog';
//Pequeñas alertas
import { MatSnackBarModule } from '@angular/material/snack-bar';
//Alerta cuando pasamos el cursor sobre un botón o caja de texto
import { MatTooltipModule }  from '@angular/material/tooltip';
//Autocompletado de cajas de texto
import { MatAutocompleteModule }  from '@angular/material/autocomplete';
//Diálogo donde muestra el calendario
import { MatDatepickerModule }  from '@angular/material/datepicker';
//Soporte de manejo de fechas en componentes com el DatePicker (implementa un adaptador de fechas)
import { MatNativeDateModule, provideNativeDateAdapter }  from '@angular/material/core';
//Cambiar el formato de las fechas
import { MomentDateModule }  from '@angular/material-moment-adapter';
//no sé xd??
import { RouterModule } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field';
//Acordión
import { MatExpansionModule } from '@angular/material/expansion';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    RouterModule,
    MatFormFieldModule,
    MatExpansionModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    provideNativeDateAdapter(MY_FORMATS)
  ]
})
export class SharedModule { }
