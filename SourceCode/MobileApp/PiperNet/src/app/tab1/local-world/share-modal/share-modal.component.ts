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

  constructor(public fileIconService:FileTypeIconService, private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private dismiss() {
    this.modalCtrl.dismiss({ message: 'Complete!' }, 'confirm');
  }

  share(){
    this.dismiss(); 
  }

}
