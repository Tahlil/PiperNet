import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-local-world',
  templateUrl: './local-world.component.html',
  styleUrls: ['./local-world.component.scss'],
})
export class LocalWorldComponent implements OnInit {

  //
  constructor() { }
  @Output() changeView = new EventEmitter();

  ngOnInit() {}

  goBack(){
    this.changeView.emit("local");
  }

}
