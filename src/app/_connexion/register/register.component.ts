import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_service/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private auth: AuthenticationService,
              private router: Router,
              public formBuilder: FormBuilder) {
  }

  public error: boolean;
  myForm: FormGroup;

  ngOnInit(): void {
    this.error = false;
    this.myForm = this.formBuilder.group(
      {
        firstName: ['', [
          Validators.required
        ]],
        lastName: ['', [
          Validators.required
        ]],
        email: ['', [
          Validators.required,
          Validators.email
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
      }/*.
      {
        validator: this.mustMatch('password', 'rePassword')
      }*/
    )
  }

  get firstName() {
    return this.myForm.get('firstName');
  }

  get lastName() {
    return this.myForm.get('lastName');
  }

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  get rePassword() {
    return this.myForm.get('rePassword');
  }



}
/*
mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
 */
