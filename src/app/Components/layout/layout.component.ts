import { Component } from '@angular/core';
import { SharedModule } from '../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
