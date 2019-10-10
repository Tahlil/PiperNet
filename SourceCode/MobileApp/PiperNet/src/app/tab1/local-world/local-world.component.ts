import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileService } from "../../services/file.service";

@Component({
  selector: 'app-local-world',
  templateUrl: './local-world.component.html',
  styleUrls: ['./local-world.component.scss'],
})
export class LocalWorldComponent implements OnInit {

  //
  constructor(private fileService: FileService) { 
    
  }
  @Output() changeView = new EventEmitter();

  ngOnInit() {}

  goBack(){
    this.changeView.emit("local");
  }

}
