import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { Empleado } from 'src/app/models/empleado';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css'],
})
export class CreateEmpleadoComponent {
  createEmpleado: FormGroup; //Representa el formulario del empleado
  submitted = false; // Para controlar si el formulario ha sido enviado y es invalido y poder dar info al user.
  loading = false; //Para poder controlar cuando mostrar el spinner de bootstrap
  id: string | null; //Para recibir el id como param para editar un empleado o null para crear
  titulo = 'Registrar nuevo empleado';
  tituloButton = 'Registrar';

  constructor(
    private formBuilder: FormBuilder, //Dependencia para form reactivo
    private _empleadoService: EmpleadoService,
    private router: Router, //Dependecia para navegar entre rutas
    private toastr: ToastrService, //Dependencia para alerts con estilo
    private route: ActivatedRoute //Dependencia para acceder al id por la ruta
  ) {
    // Inicializar el formulario con formBuilder y define campos con validadores
    this.createEmpleado = this.formBuilder.group({
      //crea un FormGroup con estos campos
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      salario: ['', Validators.required],
    });
    this.id = this.route.snapshot.paramMap.get('id'); //capturamos el id de la url
  }

  ngOnInit(): void {
    this.esEditar();
  }

  /**
   * Gestiona la lógica si hay que agregar o editar un empleado en Firebase.
   */
  agregarEditarEmpleado(): void {
    this.submitted = true;
    //Con este condicional si falta algun dato requerido en el formulario no se crea el empleado
    if (this.createEmpleado.invalid) {
      return;
    }
    // Si el formulario es valido, se crea o se actualiza el empleado
    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado(this.id);
    }
  }

  /**
   * Actualiza la información de un empleado existente en Firebase.
   * @param id del empleado
   * @remarks Se extraen los datos del formulario y se actualiza el empleado con el ID proporcionado.
   * La fecha de actualización se establece en la fecha actual.
   * Muestra un mensaje de éxito y redirige a la lista de empleados.
   */
  editarEmpleado(id: string) {
    this.loading = true;

    const empleado: Empleado = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      dni: this.createEmpleado.value.dni,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date(),
    };
    setTimeout(() => {
      this._empleadoService
        .updateEmpleado(id, empleado)
        .then(() => {
          this.loading = false;
          this.toastr.info(
            'El empleado fue actualizado con exito',
            'Empleado Actualizado'
          );
          this.router.navigate(['/list-empleados']);
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    }, 1000);
  }

  /**
   * Agrega un nuevo empleado
   * @remarks
   * Se crea un objeto empleado con los datos del formulario y se llama al servicio para agregarlo a Firebase.
   * Muestra un mensaje de éxito, detiene la carga y redirige a la lista de empleados.
   */
  agregarEmpleado() {
    this.loading = true;
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      dni: this.createEmpleado.value.dni,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    setTimeout(() => {
      this._empleadoService
      .agregarEmpleado(empleado)
      .then(() => {
        this.toastr.success(
          'El empleado fue registrado con exito',
          'Empleado Registrado'
        );
        this.loading = false;
        this.router.navigate(['/list-empleados']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
    }, 1000); 
  }

  /**
   * Verifica si se esta editando o creando un nuevo empleado
   * para mostrar los campos del form con los datos correspondientes
   */
  esEditar() {
    if (this.id !== null) {
      this.loading = true;
      this.tituloButton = 'Editar';
      this.titulo = 'Editar Empleado';
      this._empleadoService.getEmpleado(this.id).subscribe((data) => {
        this.loading = false;
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          dni: data.payload.data()['dni'],
          salario: data.payload.data()['salario'],
        });
      });
    }
  }
}
