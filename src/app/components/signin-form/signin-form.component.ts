import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css']
})
export class SigninFormComponent implements OnInit {

  form:FormGroup;
  matcher = new MyErrorStateMatcher();
  loading:boolean;


  @Output()
  openSnackBarSubject: Subject<string> = new Subject<string>();

  constructor(
    private authService:AuthService,
    private router: Router
  ) {
    this.form = new FormGroup(
      {
        login : new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9-]+')]),
        email : new FormControl(null, [Validators.required, Validators.email]),
        first : new FormControl(null, [Validators.required]),
        last : new FormControl(null, [Validators.required]),
        password : new FormControl(null, [Validators.required, Validators.minLength(6)]),
        password_confirm : new FormControl(null, [Validators.required, Validators.minLength(6)]),
      },[this.passwordConfirming]
    )
  }


  ngOnInit(): void {


  }

  enableForm(enabled:boolean){

    if(enabled){
      this.form.controls.login.enable();
      this.form.controls.email.enable();
      this.form.controls.first.enable();
      this.form.controls.last.enable();
      this.form.controls.password.enable();
      this.form.controls.password_confirm.enable();
    }else{
      this.form.controls.login.disable();
      this.form.controls.email.disable();
      this.form.controls.first.disable();
      this.form.controls.last.disable();
      this.form.controls.password.disable();
      this.form.controls.password_confirm.disable();
    }

    

  }


  formSend(){
    if(this.form.valid){
      //ok
      let login = this.form.controls.login.value;
      let email = this.form.controls.email.value;
      let first = this.form.controls.first.value;
      let last = this.form.controls.last.value;
      let pass = this.form.controls.password.value;

      this.enableForm(false);
      this.loading = true;

      this.authService.signin(login, email, first, last, pass).subscribe(r => {
        console.log('signin result : ', r);
        

        //TODO api can return why signin failed, user already exists or sth else

        if(r){
          this.openSnackBarSubject.next("Sign in successful, you can now log in");
          //setTimeout(() => this.router.navigate(['/']), 1000);

        }else{
          this.openSnackBarSubject.next("Error, signin failed");
          this.enableForm(true);
          this.loading = false;
        }

      })
    }else{
      this.openSnackBarSubject.next("Error, invalid data in form");

    }
  }
  
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('password_confirm').value) {
        return {invalid: true};
    }
  }


}
