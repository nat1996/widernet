import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { ManagerPortalComponent } from './manager-portal/manager-portal.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'userDetail/:user', component: UserPortalComponent },
  { path: 'register', component: RegisterLoginComponent },
  { path: 'manager', component: ManagerPortalComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}