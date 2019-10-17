import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @Input() isSigningIn:boolean;
  passwordMatch:boolean; 
  emailValid:boolean;

  constructor() {  
    this.isSigningIn = true;
    this.passwordMatch = true;
    this.emailValid = true;
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    let confirmPass, email;
    if(this.isSigningIn){
      email = form.value.email;
      confirmPass = form.value.confirmPassword;
      if(password !== confirmPass){
        this.passwordMatch = false;
        return;
      }

      this.passwordMatch = true;
    }
    console.log(email, password);
    if (this.isSigningIn) {
      // Send a request to login servers
    } else {
      // Send a request to signup servers
    }
  }

  onSwitchAuthMode(){
    this.isSigningIn = !this.isSigningIn;    
  }

  test(emailCtrl): boolean{
    console.log(emailCtrl);
    return true;
  }
}
