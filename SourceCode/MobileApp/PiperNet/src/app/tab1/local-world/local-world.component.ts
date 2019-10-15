import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { IonItemSliding } from "@ionic/angular";

import { FileModalComponent } from "./file-modal/file-modal.component";
import { FileRenameModalComponent } from "./file-rename-modal/file-rename-modal.component";
import { FileService } from "../../services/file.service";
import { FileTypeIconService } from "../../services/file-type-icon.service";
import { File } from "../../models/file.model";

@Component({
  selector: "app-local-world",
  templateUrl: "./local-world.component.html",
  styleUrls: ["./local-world.component.scss"]
})
export class LocalWorldComponent implements OnInit {
  uploadedFiles: File[];
  downloadedFiles: File[];
  uploadSort: string;
  downloadSort: string;
  fullUploadList: File[];
  fullDownloadList: File[];

  constructor(
    private fileIconService: FileTypeIconService,
    private fileService: FileService,
    private modalCtrl: ModalController
  ) {
    this.downloadedFiles = [];
    this.uploadedFiles = [];
    let uploadedfilesPromise = this.fileService.getUploadedFiles();
    this.getUploadedFiles(uploadedfilesPromise);
    let downloadedfilesPromise = this.fileService.getDowloadedFiles();
    this.getDownloadedFiles(downloadedfilesPromise);    
  }

  @Output() changeView = new EventEmitter();

  ngOnInit() {

  }

  private sortAscendingOrder(fileList, sortBy){
    fileList.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : -1);
  }

  private sortDescendingOrder(fileList, sortBy){
    fileList.sort((a, b) => (a[sortBy] > b[sortBy]) ? -1 : 1);
  }

  sortUploads(){
    console.log("U: " + this.uploadSort);
    let splitedValue = this.uploadSort.split("-");
    splitedValue[1] === "a" ? this.sortAscendingOrder(this.uploadedFiles, splitedValue[0]) : this.sortDescendingOrder(this.uploadedFiles, splitedValue[0]);
  }

  sortDownloads(){    
    console.log("D: " + this.downloadSort);
    let splitedValue = this.uploadSort.split("-");
    splitedValue[1] === "a" ? this.sortAscendingOrder(this.downloadedFiles, splitedValue[0]) : this.sortDescendingOrder(this.downloadedFiles, splitedValue[0]);
  }

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
      this.fullUploadList = this.uploadedFiles;
    });
  }

  private getDownloadedFiles(downloadedFilesPromise) {
    let index = 0;
    downloadedFilesPromise.then(res => {
      for (const file of res) {
        console.log("File promise: " + file);
        file.then(fileInfo => {
          this.downloadedFiles[index] = fileInfo;
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
      this.fullDownloadList = this.downloadedFiles;
    });
  }

  getImagePath(fileType: string): string {
    return this.fileIconService.getFileImagePath(fileType);
  }

  onDelete(type: string, fileName: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.deleteFile(type, fileName);
  }

  open(type: string, fileType: string, filePath: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.fileService.openFile(fileType, filePath);
  }

  private deleteFile(type: string, fileName: string) {
    this.fileService.fileDelete(type, fileName);
    let index;
    if (type === "Upload") {
      index = this.getFileIndex(this.uploadedFiles, fileName);
      this.uploadedFiles.splice(index, 1); 
    } else if (type === "Download") {
      index = this.getFileIndex(this.downloadedFiles, fileName); 
      this.downloadedFiles.splice(index, 1);
    } else {
      console.error("Type should either be Upload or Download.");
    }
  }

  private getFileIndex(fileArray, fileName:string){
    for (let index = 0; index < fileArray.length; index++) {
      const file = fileArray[index];
      if(file.name === fileName) 
        return index;
    }
    console.error("Index not found");
    return -1;
  }

  private refresh(currentAction:string){
    if (currentAction === 'Download') {
      this.getDownloadedFiles(this.fileService.getDowloadedFiles());
    }
    else if (currentAction === 'Upload') {
      this.getUploadedFiles(this.fileService.getUploadedFiles());
    }
  }

  openModal(action: 'Upload' | 'Download') {
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
        console.log(resultData.role);
        if (resultData.role === "confirm") {
          this.refresh(action);            
          console.log(action + "ed File");
        }
        else{
          console.error("Something went wrong...");
        }
      });
  }

  openRenameModal(actionType: 'Upload' | 'Download', file: File, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.modalCtrl
      .create({
        component: FileRenameModalComponent,
        componentProps: {file : file, actionType: actionType }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === "confirm") {
          this.refresh(actionType);
          console.log("Selected file: " + file.name);
          console.log("Confirm....");
        }
      });
  }

  onSearchChange($event){
    let searchDigest = $event.target.value;
    if(searchDigest === ""){
      this.uploadedFiles = this.fullUploadList;
      this.downloadedFiles = this.downloadedFiles;
    } 
    else{
      this.uploadedFiles = this.fullUploadList.filter(file => file.name.includes(searchDigest));
      this.downloadedFiles = this.fullDownloadList.filter(file => file.name.includes(searchDigest));
    }
    console.log("Search res: " + searchDigest);
  }
}
