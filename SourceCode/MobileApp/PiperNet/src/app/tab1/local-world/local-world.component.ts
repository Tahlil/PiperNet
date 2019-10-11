import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { IonItemSliding } from '@ionic/angular';


import { FileModalComponent } from "./file-modal/file-modal.component";
import { FileService } from "../../services/file.service";
import { FileTypeIconService } from "../../services/file-type-icon.service";


@Component({
  selector: "app-local-world",
  templateUrl: "./local-world.component.html",
  styleUrls: ["./local-world.component.scss"]
})
export class LocalWorldComponent implements OnInit {
  uploadedFiles: any[];
  downloadedFiles: any[];

  constructor(
    private fileIconService: FileTypeIconService,
    private fileService: FileService,
    private modalCtrl: ModalController
  ) {
    this.downloadedFiles = [];
    this.uploadedFiles = [];
    let uploadedfilesPromise = this.fileService.getUploadedFiles();
    this.getUploadedFiles(uploadedfilesPromise);
    let downloadedfilesPromise = this.fileService.getUploadedFiles();
    this.getUploadedFiles(downloadedfilesPromise);
  }

  @Output() changeView = new EventEmitter();

  ngOnInit() {}

  goBack() {
    this.changeView.emit("local");
  }

  private getUploadedFiles(uploadedfilesPromise) {
    let index = 0;
    uploadedfilesPromise.then(res => {
      for (const file of res) {
        console.log("File promise: " + file);
        file.then(fileInfo => {
          this.uploadedFiles[index] = fileInfo;
          console.log(
            "File Info: " +
              fileInfo.name +
              " " +
              fileInfo.type +
              " " +
              fileInfo.size +
              " " +
              fileInfo.path
          );
          index++;
        });
      }
    });
  }

  private getDownloadedFiles(downloadedfilesPromise) {
    let index = 0;
    downloadedfilesPromise.then(res => {
      for (const file of res) {
        console.log("File promise: " + file);
        file.then(fileInfo => {
          this.uploadedFiles[index] = fileInfo;
          console.log(
            "File Info: " +
              fileInfo.name +
              " " +
              fileInfo.type +
              " " +
              fileInfo.size +
              " " +
              fileInfo.path
          );
          index++;
        });
      }
    });
  }

  getImagePath(fileType: string): string {
    return this.fileIconService.getFileImagePath(fileType);
  }

  onDelete(type:string, fileName: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.deleteFile(type, fileName);
  }

  private deleteFile(type:string, fileName:string){
    // this.
  }

  openModal(action: string) {
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
        if (resultData.role === "confirm") {
          console.log(action + "ed File");
        }
      });
  }
}
