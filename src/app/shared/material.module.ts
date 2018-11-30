import { NgModule } from '@angular/core';
import {
  MatTabsModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatDividerModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  imports: [
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule
  ],
  exports: [
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule
  ]
})
export class MyMaterialModule {}
