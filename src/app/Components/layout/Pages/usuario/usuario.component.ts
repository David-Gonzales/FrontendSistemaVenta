import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements AfterViewInit{

  columnasTabla:string[]=['nombres', 'apellidos', 'telefono', 'correo', 'rol', 'estado','acciones']
  dataInicio:Usuario[]=[];
  dataListaUsuarios: MatTableDataSource<Usuario> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerUsuarios(){
    this._usuarioServicio.listar().subscribe({
      next:(respuesta)=> {
        if(respuesta.succeeded){
          // Si 'data' es un arreglo de Usuarios, asignarlo a la tabla
          if (Array.isArray(respuesta.data)) {
            this.dataListaUsuarios.data = respuesta.data;
          } else {
            console.error("La propiedad 'data' no es un arreglo de Usuarios.");
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los usuarios","Opps!");
      },
      error:(e)=>{}
    });
  }

  ngOnInit(): void{
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true,
      data: usuario

    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: usuario.nombres + " " + usuario.apellidos,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.id).subscribe({
          next:(respuesta)=>{
            if(respuesta.succeeded){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado","Listo!");
              this.obtenerUsuarios();
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario","Error");
            }
          },
          error:(e)=>{}
        });
      }
    })
  }
}
