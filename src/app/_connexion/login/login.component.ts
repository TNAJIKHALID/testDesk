import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_service/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public error: boolean;
  constructor(private auth:AuthenticationService,
              private router:Router,
              public formBuilder: FormBuilder) { }
  myForm: FormGroup;
  ngOnInit(): void {
    this.error = false;
    this.myForm = this.formBuilder.group(
      {
        email:['',[
          Validators.required/*,
          Validators.email*/
        ]],
        password:['',[
          Validators.required
        ]]
      }
    )
  }

  get email(){
    return this.myForm.get('email');
  }
  get passwordd(){
    return this.myForm.get('password');
  }

  onLogin() {
    this.username = this.email.value;
    this.password = this.passwordd.value;
    console.log(this.username);
    this.auth.login(this.username,this.password);
    if (this.auth.isAuthenticated){
      console.log('Good');
      this.router.navigateByUrl('/home');
      this.error = false;
    }else {
      console.log('Bad');
      this.error = true;
    }
  }
}
