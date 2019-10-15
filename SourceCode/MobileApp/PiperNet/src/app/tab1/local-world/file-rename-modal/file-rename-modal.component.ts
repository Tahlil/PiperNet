import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileService } from "../../../services/file.service";
import { File } from '../../../models/file.model';
import { FileTypeIconService } from "../../../services/file-type-icon.service";

@Component({
  selector: 'app-file-rename-modal',
  templateUrl: './file-rename-modal.component.html',
  styleUrls: ['./file-rename-modal.component.scss'],
})
export class FileRenameModalComponent implements OnInit {
  @Input() file:File;
  @Input() actionType:'Download' | 'Upload';

  newName:string;
  valid:boolean;

  constructor(private fileService: FileService, private fileIconService:FileTypeIconService, private modalCtrl: ModalController) {
    this.newName = "";
    this.valid = true;
  }

  ngOnInit() {
    console.log(this.file);
  }

  getImagePath(){
    console.log("Getting image path");
    let imagePath = this.fileIconService.getFileImagePath(this.file.name); 
    return imagePath;
  }

  splitPath(filePath: string): string{
    let splitedPath = filePath.split("/"), finalPath = "", i = 3;
    for (; i < splitedPath.length-1; i++) {
      finalPath += (splitedPath[i] + " / ");
    }
    finalPath += splitedPath[i];
    return finalPath;
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private dismiss() {
    this.valid = true;
    this.modalCtrl.dismiss({ message: 'Complete!' }, 'confirm');
  }

  onSubmit(){
    if (this.newName === "") {
      this.valid = false;
      return;
    }
    console.log("New name: " + this.newName);
    this.fileService.rename(this.actionType, this.file.name, this.newName+"."+this.file.type);
    this.dismiss();
  }

  getPrettyDate(time){
    return new Date(time).toUTCString();
  }


}
