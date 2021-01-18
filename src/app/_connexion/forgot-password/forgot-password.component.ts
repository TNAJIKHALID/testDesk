import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_service/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private auth: AuthenticationService,
              private router: Router,
              public formBuilder: FormBuilder) {
  }

  public error: boolean;
  emailForm: FormGroup;
  resetPasswordForm: FormGroup;
  resetPassword: boolean = false;

  ngOnInit(): void {
    this.error = false;
    this.emailForm = this.formBuilder.group(
      {
        email: ['', [
          Validators.required,
          Validators.email
        ]]
      }
    )
    this.resetPasswordForm = this.formBuilder.group(
      {
        validationCode: ['', [
          Validators.required
        ]],
        password: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(8)
        ]],
        rePassword: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(8)
        ]]
      }
    )
  }

  get email() {
    return this.emailForm.get('email');
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get validationCode(){
    return this.resetPasswordForm.get('validationCode');
  }

  get rePassword() {
    return this.resetPasswordForm.get('rePassword');
  }

  onResetPassword() {
    this.resetPassword = true;
  }
}
