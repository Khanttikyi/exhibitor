import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExhibitorRegisterFormComponent } from './pages/exhibitor-register-form/exhibitor-register-form.component';
import { HomeComponent } from './pages/home/home.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'exhibitor-register-form', component: ExhibitorRegisterFormComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
