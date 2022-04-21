import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginParentComponent } from './login-parent/login-parent.component';
import { LoginComponent } from './login-parent/login/login.component';
import { HomeComponent } from './moduli/home/home.component';
import { PocetnastranaComponent } from './pocetnastrana/pocetnastrana.component';
import { VerifikacijaComponent } from './proba/verifikacija/verifikacija.component';
import { RegisterParentComponent } from './register-parent/register-parent.component';
import { RegisterComponent } from './register-parent/register/register.component';
import { AuthRegisterGuard } from './shared/auth-register.guard';
import { AuthGuard } from './shared/auth.guard';
import { NotAuthGuard } from './shared/not-auth.guard';
import { StatisticComponent } from './statistic/statistic.component';
import { TreningComponent } from './trening/trening.component';
import { PocetnatestComponent } from './pocetnatest/pocetnatest.component';
import { TeamComponent } from './team/team.component';
import { MojNalogComponent } from './moj-nalog/moj-nalog.component';
const routes: Routes = [
  {
    path:'',
    // redirectTo:'pocetna',
    // pathMatch:'full'
    component:DefaultComponent,
    children:[{
      path:'',
      component:PocetnastranaComponent
    },
    {
      path:'MojNalog',
      component:MojNalogComponent
    },
  {
    path:'pocetna',component:PocetnastranaComponent,canActivate:[NotAuthGuard]
  },
  {
    path:'success-login',component:LoginParentComponent,canActivate:[AuthGuard]
  },
  
  {
    path:'statistic',component:StatisticComponent
  },
  {
    path:'training',component:TreningComponent
  }]
  },
  {
    path:'login',component:LoginComponent,canActivate:[NotAuthGuard]
  },
  {
    path:'signup',component:RegisterComponent,canActivate:[NotAuthGuard]
  },
  {
    path:'verifikacija',component:VerifikacijaComponent
  },
  {
    path:"test",component:PocetnatestComponent
  },
  {
    path:"team",component:TeamComponent
  },
  {
    path:'success-register',component:RegisterParentComponent,canActivate:[AuthRegisterGuard]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
