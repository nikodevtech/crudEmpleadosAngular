import { EmpleadoService } from 'src/app/services/empleado.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Empleado } from 'src/app/models/empleado';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css'],
})
export class ListEmpleadosComponent {
  empleados: Empleado[] = [];

  constructor(private _empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.getEmpleados();
  }

  //element.payload.doc.id --> accede al id que tiene cada documento (registro) en firebase
  //element.payload.doc.data -->  accede a la data (campos) del documento

  /**
   * Obtiene todos los empleados de firebase con el servicio
   * @returns suscripcion al observable
   */
  getEmpleados() {
    return this._empleadoService.getEempleados().subscribe((data) => {
      this.empleados = [];
      data.forEach((element: any) => {
        //iteramos sobre los datos del observable
        this.empleados.push({
          id: element.payload.doc.id, // asignamos el id del registro
          ...element.payload.doc.data(), // asignamos el resto de los atributos/campos con spread operator
        });
      });
    });
  }

  /**
   * Elimina un empleado llamando al servicio
   * @param id del empleado a eliminar
   */
  eliminarEmpleado(id: string) {
    this._empleadoService
      .eliminarEmpleado(id)
      .then(() => {
        console.log('empleado eliminado');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Método para mostrar un Alert con la libreria sweetalert para confirmar acciones
   * @param id id del empleado a borrar
   */
  confirmarAccion(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#18BE79',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Se elimina empleado si se confirma la acción
        this.eliminarEmpleado(id);
        Swal.fire(
          '¡Acción completada!',
          'Empleado eliminado con éxito.',
          'success'
        );
      }
    });
  }
}
