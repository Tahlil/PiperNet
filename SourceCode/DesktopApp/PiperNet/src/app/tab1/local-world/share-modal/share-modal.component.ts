import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { File } from '../../../models/file.model';
import { FileTypeIconService } from "../../../services/file-type-icon.service";

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
})
export class ShareModalComponent implements OnInit {
  @Input() files:File[];

  shareTo: string;
  valid:boolean;

  constructor(public fileIconService:FileTypeIconService, private modalCtrl: ModalController) {
    this.shareTo = "";
    this.valid = true;
  }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private dismiss() {
    this.valid = true;
    this.modalCtrl.dismiss({ message: 'Complete!' }, 'confirm');
  }

  share(){
    if (this.shareTo === "") {
      this.valid = false;
      return;
    }
    this.dismiss(); 
  }

}
