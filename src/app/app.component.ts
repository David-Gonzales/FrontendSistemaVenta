import { Component } from '@angular/core';import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';

import { RouterOutlet } from '@angular/router';
import { SharedModule } from './Reutilizable/shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TreeGridModule, RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AppSistemaVentas';
}
