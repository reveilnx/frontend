import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OperationsPage } from './operations';

@NgModule({
  declarations: [
    OperationsPage,
  ],
  imports: [
    IonicPageModule.forChild(OperationsPage),
  ],
})
export class OperationsPageModule {}
