import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { PiperNetWorldComponent } from "./piper-net-world/piper-net-world.component";
import { LocalWorldComponent } from "./local-world/local-world.component";
import { FileModalComponent } from "./local-world/file-modal/file-modal.component";
import { FileRenameModalComponent } from "./local-world/file-rename-modal/file-rename-modal.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page, PiperNetWorldComponent, LocalWorldComponent, FileModalComponent, FileRenameModalComponent],
  entryComponents: [FileModalComponent, FileRenameModalComponent]
})
export class Tab1PageModule {}
