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
  phoneValid:boolean;

  constructor() {  
    this.isSigningIn = true;
    this.passwordMatch = true;
    this.emailValid = true;
    this.phoneValid = true;
  }

  ngOnInit() {
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  private validatePhone(phone) {
    var re = /^(?:\+88|01)?(?:\d{11}|\d{13})$/;
    return re.test(String(phone).toLowerCase()) || phone === "";
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    let confirmPass, email, phone;
    if(!this.isSigningIn){
      email = form.value.email;
      confirmPass = form.value.confirmPassword;
      phone = form.value.phone;
      let valid = true;
      if(password !== confirmPass){
        this.passwordMatch = false;
        valid = false;
      }
      if(!this.validateEmail(email)){
        this.emailValid = false;
        console.log("Invalid email");
        valid = false;
      }
      if(this.validatePhone(phone)){
        this.phoneValid = false; 
        valid = false;
      }
      if(!valid) return;
      this.emailValid = true;
      this.passwordMatch = true;
      this.phoneValid = true;
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
