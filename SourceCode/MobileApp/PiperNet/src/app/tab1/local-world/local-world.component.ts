import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FileModalComponent } from "./file-modal/file-modal.component";
import { FileService } from "../../services/file.service";
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-local-world',
  templateUrl: './local-world.component.html',
  styleUrls: ['./local-world.component.scss'],
})
export class LocalWorldComponent implements OnInit {

  constructor(private fileService: FileService, private modalCtrl: ModalController) { 
    let files = this.fileService.getUploadedFiles();
    console.log("File promises: ");
    files.then(res => {
      console.log(res);
      for (const file of res) {
        console.log("File promise: " + file);
        file.then(fileInfo => {
          console.log("File Info: " + fileInfo.name + " " + fileInfo.type + " " + fileInfo.size + " " + fileInfo.path);          
        });
      }
    });
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
