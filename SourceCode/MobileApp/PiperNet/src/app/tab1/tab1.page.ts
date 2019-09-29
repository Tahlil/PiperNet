import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  homeViewClass:string;
  currentView:string; // possible values: home, local, piperNet


  constructor() {
    this.homeViewClass = "foggy-forest";
    this.currentView = "home";
  }

  goToLocalWorld(){
    console.log("Clicked go to Local world.");
    this.homeViewClass = "localWrold";
    this.currentView = "local";
  }

  goToPiperNetWorld(){
    console.log("Clicked go to pipernet world.");
    this.homeViewClass = "pipernetWrold";
    this.currentView = "piperNet";
  }

}
