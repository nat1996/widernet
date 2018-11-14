import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { ManagerPortalComponent } from './manager-portal/manager-portal.component';
import { ManagerLoginComponent } from './manager-login/manager-login.component';
import { ManagerRegisterComponent } from './manager-register/manager-register.component';
import { TestComponent } from './test/test.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'userDetail/:user', component: UserPortalComponent },
  { path: 'register', component: RegisterLoginComponent },
  { path: 'manager/:user', component: ManagerPortalComponent },
  { path: 'managerLogin', component: ManagerLoginComponent },
  { path: 'managerRegister', component: ManagerRegisterComponent },
  { path: 'test', component: TestComponent}
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}