import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.scss'],
})
export class FileModalComponent implements OnInit {
  @Input() selectedAction:string;

  constructor(private modalCtrl: ModalController) { }

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

  takePhoto(){
    this.dismiss();
  }

}
