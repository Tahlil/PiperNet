import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FileModalComponent } from "./file-modal/file-modal.component";

@Component({
  selector: 'app-local-world',
  templateUrl: './local-world.component.html',
  styleUrls: ['./local-world.component.scss'],
})
export class LocalWorldComponent implements OnInit {

  //
  constructor(private modalCtrl: ModalController) { 

  }
  @Output() changeView = new EventEmitter();

  ngOnInit() {}

  goBack(){
    this.changeView.emit("local");
  }

  openModal(action:string){
    this.modalCtrl
      .create({
        component: FileModalComponent,
        componentProps: { selectedAction: action }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          console.log(action + "ed File");
        }
      });
  }

}
