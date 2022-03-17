import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginParentComponent } from './login-parent/login-parent.component';
import { LoginComponent } from './login-parent/login/login.component';
import { PocetnastranaComponent } from './pocetnastrana/pocetnastrana.component';
import { RegisterComponent } from './register-parent/register/register.component';
import { AuthGuard } from './shared/auth.guard';
import { NotAuthGuard } from './shared/not-auth.guard';

const routes: Routes = [
  {
    path:'',redirectTo:'pocetna',pathMatch:'full'
  },
  {
    path:'login',component:LoginComponent,canActivate:[NotAuthGuard]
  },
  {
    path:'signup',component:RegisterComponent,canActivate:[NotAuthGuard]
  },
  {
    path:'pocetna',component:PocetnastranaComponent,canActivate:[NotAuthGuard]
  },
  {
    path:'success-login',component:LoginParentComponent,canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
