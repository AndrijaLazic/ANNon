import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProizvodiComponent } from './proizvodi/proizvodi.component';
const routes: Routes = [
  {path:"proizvodi",component:ProizvodiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
