import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PiperNetWorldPage } from './piper-net-world.page';

const routes: Routes = [
  {
    path: '',
    component: PiperNetWorldPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PiperNetWorldPage]
})
export class PiperNetWorldPageModule {}
