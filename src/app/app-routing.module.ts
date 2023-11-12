import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEmpleadosComponent } from './components/list-empleados/list-empleados.component';
import { CreateEmpleadoComponent } from './components/create-empleado/create-empleado.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listEmpleados',
    pathMatch: 'full'
  },
  {
    path: 'listEmpleados',
    component: ListEmpleadosComponent
  },
  {
    path: 'createEmpleado',
    component: CreateEmpleadoComponent
  },
  {
    path: 'editEmpleado/:id',
    component: CreateEmpleadoComponent
  },
  {
    path: '**',
    redirectTo: 'listEmpleados'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
