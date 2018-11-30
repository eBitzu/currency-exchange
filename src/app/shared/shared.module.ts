import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MyMaterialModule } from './material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './services/auth.guard';
import { LoginService } from './services/login.service';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MyMaterialModule
  ],
  providers: [AuthGuard, LoginService],
  exports: [
    LogoComponent,
    NavBarComponent,
    MyMaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [NavBarComponent, LogoComponent]
})
export class SharedModule {}
