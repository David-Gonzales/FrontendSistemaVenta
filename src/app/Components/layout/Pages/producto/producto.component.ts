import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { Producto } from '../../../../Interfaces/producto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {

  columnasTabla:string[] = ['nombre', 'capacidad', 'unidad', 'stock', 'precio', 'estado', 'acciones'];
  dataInicio:Producto[]=[];
  dataListaProductos: MatTableDataSource<Producto> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerProductos(){
    this._productoServicio.listar().subscribe({
      next:(respuesta) => {
        if(respuesta.succeeded){
          if(Array.isArray(respuesta.data)){
            this.dataListaProductos.data = respuesta.data;
          }else{
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los productos","Opps!");
      },
      error:(e)=>{}
    });
  }

  ngOnInit(): void{
    this.obtenerProductos();
  }

  ngAfterViewInit(): void{
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerProductos();
    });
  }

  editarProducto(producto: Producto){
    this.dialog.open(ModalProductoComponent, {
      disableClose:true,
      data: producto

    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerProductos();
    });
  }

  eliminarProducto(producto:Producto){
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._productoServicio.eliminar(producto.id).subscribe({
          next:(respuesta)=>{
            if(respuesta.succeeded){
              this._utilidadServicio.mostrarAlerta("El prducto fue eliminado","Listo!");
              this.obtenerProductos();
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto","Error");
            }
          },
          error:(e)=>{}
        });
      }
    })
  }
}
