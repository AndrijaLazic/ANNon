import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginParentComponent } from './login-parent/login-parent.component';
import { LoginComponent } from './login-parent/login/login.component';
import { PocetnastranaComponent } from './pocetnastrana/pocetnastrana.component';
import { VerifikacijaComponent } from './proba/verifikacija/verifikacija.component';
import { RegisterParentComponent } from './register-parent/register-parent.component';
import { RegisterComponent } from './register-parent/register/register.component';
import { AuthRegisterGuard } from './shared/auth-register.guard';
import { AuthGuard } from './shared/auth.guard';
import { NotAuthGuard } from './shared/not-auth.guard';
import { StatisticComponent } from './statistic/statistic.component';

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
  },
  {
    path:'success-register',component:RegisterParentComponent,canActivate:[AuthRegisterGuard]
  },
  {
    path:'verifikacija',component:VerifikacijaComponent,canActivate:[AuthRegisterGuard]
  },
  {
    path:'statistic',component:StatisticComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
