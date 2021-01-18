import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './_connexion/login/login.component';
import {HomeComponent} from './_static/home/home.component';
import {TestUIComponent} from './_evaluation/test-ui/test-ui.component';
import {AuthenticationGuardService} from './_service/authentication-guard.service';
import {RegisterComponent} from './_connexion/register/register.component';
import {ScoreComponent} from './_evaluation/score/score.component';
import {ImageComponent} from './_evaluation/image/image.component';
import {ErrorComponent} from './_static/error/error.component';
import {ForgotPasswordComponent} from './_connexion/forgot-password/forgot-password.component';

const routes: Routes = [
  {path: 'login', component : LoginComponent},
  {path: 'forgot', component : ForgotPasswordComponent},
  {path: '', component : HomeComponent, canActivate: [AuthenticationGuardService]},
  {path: 'register', component : RegisterComponent},
  {path: 'home', component : HomeComponent, canActivate: [AuthenticationGuardService]},
  {path: 'test/:type', component : TestUIComponent, canActivate: [AuthenticationGuardService]},
  {path: 'score', component : ScoreComponent, canActivate: [AuthenticationGuardService]},
  {path: 'image', component : ImageComponent, canActivate: [AuthenticationGuardService]},
  {path: '**',  component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
