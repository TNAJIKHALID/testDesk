import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_connexion/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { TestComponent } from './_evaluation/test/test.component';
import { ScoreComponent } from './_evaluation/score/score.component';
import { HomeComponent } from './_static/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatDividerModule} from '@angular/material/divider';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';
import { TestUIComponent } from './_evaluation/test-ui/test-ui.component';
import { RegisterComponent } from './_connexion/register/register.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ImageComponent } from './_evaluation/image/image.component';
import { ErrorComponent } from './_static/error/error.component';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from './_static/header/header.component';
import { ForgotPasswordComponent } from './_connexion/forgot-password/forgot-password.component';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TestComponent,
    ScoreComponent,
    HomeComponent,
    TestUIComponent,
    RegisterComponent,
    ImageComponent,
    ErrorComponent,
    HeaderComponent,
    ForgotPasswordComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        DragDropModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatTableModule,
        NgxPaginationModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule,
        MatStepperModule,
        MatButtonModule,
        MatDialogModule,
        MatCardModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatTreeModule,
        MatIconModule,
        MatProgressBarModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
