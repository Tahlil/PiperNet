import { Component } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  homeViewClass:string;
  currentView:string; // possible values: home, local, piperNet
  transitionalClass:string;

  constructor() {
    this.homeViewClass = "foggy-forest";
    this.currentView = "home";
    this.transitionalClass = "";
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

  backToHome(switchViewFrom){
    console.log("Switched View From: "+ switchViewFrom);
    if (switchViewFrom === "local") {
      this.homeViewClass = "backFromLocal";
    }
    else if (switchViewFrom === "piperNet"){
      this.homeViewClass = "backFromPiper";
    }
    setTimeout(() => {
      this.homeViewClass = "foggy-forest";
      this.currentView = "home";
    }, 900);
  }

}
