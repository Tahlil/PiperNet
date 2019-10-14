import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FileService } from "../../../services/file.service";

@Component({
  selector: "app-file-modal",
  templateUrl: "./file-modal.component.html",
  styleUrls: ["./file-modal.component.scss"]
})
export class FileModalComponent implements OnInit {
  @Input() selectedAction: 'Upload' | 'Download';

  constructor(
    private fileService: FileService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, "cancel");
  }

  private dismiss() {
    this.modalCtrl.dismiss({ message: "Complete!" }, "confirm");
  }

  async takePhoto() {
    this.fileService.takePhoto(this.selectedAction).then(_ => {
      this.dismiss();
    });
  }

  clickFileInput(){
    document.getElementById("inputFile").click();
  }

  changeListener($event) {
    let myFile = $event.target.files[0];
    let base64File;
    let fileReader = new FileReader();
    fileReader.onload = e => {
      base64File = fileReader.result;
      const type = base64File.split(";")[1];
      base64File = type.split(",")[1];
      this.fileService.fileWrite(this.selectedAction, myFile.name, base64File);
      this.dismiss();
    };
    fileReader.readAsDataURL(myFile);
  }
}
