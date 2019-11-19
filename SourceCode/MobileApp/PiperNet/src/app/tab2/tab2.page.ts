import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  showOptions: boolean;
  showSignIn: boolean;
  showSignUp: boolean;

  constructor() {
    console.log("Showing Options...");
    
    this.showSignIn = false;
    this.showSignUp = false;
    this.showOptions = true;
  }

  gotoSignIn() {
    this.showOptions = false;
    this.showSignIn = true;    
  }

  gotoSignUp() {
    this.showOptions = false;
    this.showSignUp = true;
  }

  goBackToOptions(){
    this.showOptions = true;
    this.showSignIn = false;
    this.showSignUp = false;
  }
}
