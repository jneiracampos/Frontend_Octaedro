import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from "./mainpage/mainpage.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { TestComponent } from "./test/test.component";
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { CompanyServicesComponent } from './company-services/company-services.component';
import { AddUserComponent } from "./add-user/add-user.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminBaseComponent } from "./adminBase/adminBase.component";
import { SearcherProgramasComponent } from './searcher-programas/searcherProgramas.component';
import { SearcherGruposComponent } from './searcher-grupos/searcher-grupos.component';
import { SearcherHabilidadesComponent } from './searcher-habilidades/searcher-habilidades.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { CookiesComponent } from './cookies/cookies.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
const routes: Routes = [
   {path: "", redirectTo: "/", pathMatch: "full"},
   {path: "", component: MainpageComponent}, 
   {path: "login", component: LoginComponent}, 
   {path: "register", component: RegisterComponent},
   {path: "test", component: TestComponent}, 
   {path: "recover", component: RecoverPasswordComponent}, 
   {path: "profile", component: ProfileComponent}, 
   {path: "change_password", component: ChangePasswordComponent}, 
   {path: "services", component: CompanyServicesComponent}, 
   {path: "add-user", component: AddUserComponent}, 
   {path: "dashboard", component: DashboardComponent},
   {path: "adminBase", component: AdminBaseComponent},
   {path: "terminos-y-condiciones", component: PoliticasComponent}, 
   {path: "cookies", component: CookiesComponent}, 
   {path: "survey", component: EncuestaComponent}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
