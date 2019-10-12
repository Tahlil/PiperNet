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

  constructor(private fileService: FileService, public fileIconService:FileTypeIconService, private modalCtrl: ModalController) { }

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
    this.modalCtrl.dismiss({ message: 'Complete!' }, 'confirm');
  }

  
}
