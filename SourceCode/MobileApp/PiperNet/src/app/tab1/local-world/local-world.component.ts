import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FileModalComponent } from "./file-modal/file-modal.component";
import { FileService } from "../../services/file.service";

@Component({
  selector: 'app-local-world',
  templateUrl: './local-world.component.html',
  styleUrls: ['./local-world.component.scss'],
})
export class LocalWorldComponent implements OnInit {

  uploadedFiles:any[];
  downloadedFiles:any[];

  constructor(private fileService: FileService, private modalCtrl: ModalController) { 
    this.downloadedFiles = [];
    this.uploadedFiles = [];
    let uploadedfilesPromise = this.fileService.getUploadedFiles();
    this.getUploadedFiles(uploadedfilesPromise);
    let downloadedfilesPromise = this.fileService.getUploadedFiles();
    this.getUploadedFiles(downloadedfilesPromise);
    
  }
  @Output() changeView = new EventEmitter();

  ngOnInit() {}

  goBack(){
    this.changeView.emit("local");
  }

  private getUploadedFiles(uploadedfilesPromise){
    let index = 0;
    uploadedfilesPromise.then(res => {
      for (const file of res) {
        console.log("File promise: " + file);
        file.then(fileInfo => {
          this.uploadedFiles[index] = fileInfo;
          console.log("File Info: " + fileInfo.name + " " + fileInfo.type + " " + fileInfo.size + " " + fileInfo.path);
          index++;          
        });
      }
    });
  }

  private getDownloadedFiles(downloadedfilesPromise){
    let index = 0;
    downloadedfilesPromise.then(res => {
      for (const file of res) {
        console.log("File promise: " + file);
        file.then(fileInfo => {
          this.uploadedFiles[index] = fileInfo;
          console.log("File Info: " + fileInfo.name + " " + fileInfo.type + " " + fileInfo.size + " " + fileInfo.path);
          index++;          
        });
      }
    }); 
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
