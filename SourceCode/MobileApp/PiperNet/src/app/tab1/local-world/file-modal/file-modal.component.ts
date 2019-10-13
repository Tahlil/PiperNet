import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileService } from "../../../services/file.service";


@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.scss'],
})
export class FileModalComponent implements OnInit {
  @Input() selectedAction:string;

  constructor(private fileService: FileService, private modalCtrl: ModalController) {
  }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private dismiss() {
    this.modalCtrl.dismiss({ message: 'Complete!' }, 'confirm');
  }

  getFile(){
    this.dismiss();
  }

  async takePhoto(){
    this.fileService.takePhoto(this.selectedAction).then((_) => {
      this.dismiss();
    });    
  }

}
