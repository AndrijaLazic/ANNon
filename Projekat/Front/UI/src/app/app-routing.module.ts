import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-parent/login/login.component';
import { PocetnastranaComponent } from './pocetnastrana/pocetnastrana.component';
import { RegisterComponent } from './register-parent/register/register.component';

const routes: Routes = [
  {
    path:'',redirectTo:'pocetna',pathMatch:'full'
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'signup',component:RegisterComponent
  },
  {
    path:'pocetna',component:PocetnastranaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
