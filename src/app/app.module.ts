import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConversionComponent } from './conversion/conversion.component';
import { LoginComponent } from './login/login.component';
import { ConversionModule } from './conversion/conversion.module';
import { AuthGuard } from './shared/services/auth.guard';
import { LoginModule } from './login/login.module';

const appRoutes: Routes = [
  { path: 'home', component: ConversionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NoopAnimationsModule,
    LoginModule,
    ConversionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
