import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-piper-net-world',
  templateUrl: './piper-net-world.component.html',
  styleUrls: ['./piper-net-world.component.scss'],
})
export class PiperNetWorldComponent implements OnInit {

  @Output() changeView = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  goBack(){
    this.changeView.emit("piperNet");
  }

}
