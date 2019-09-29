import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  homeViewClass:string;

  constructor() {
    this.homeViewClass = "foggy-forest";
  }

  goToLocalWorld(){
    console.log("Clicked go to Local world.");
    this.homeViewClass = "localWrold";
  }

  goToPiperNetWorld(){
    console.log("Clicked go to pipernet world.");
    this.homeViewClass = "pipernetWrold";
  }

}
