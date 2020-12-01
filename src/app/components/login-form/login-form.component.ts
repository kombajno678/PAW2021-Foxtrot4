import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';
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
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {


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
        password : new FormControl(null, [Validators.required]),
      }
    )
  }

  

  ngOnInit(): void {

    


  }
  formSend(){
    if(this.form.valid){
      //ok
      let login = this.form.controls.login.value;
      let pass = this.form.controls.password.value;

      this.form.controls.login.disable();
      this.form.controls.password.disable();
      this.loading = true;

      this.authService.login(login, pass).subscribe(r => {
        console.log('login result : ', r);

        //TODO api can return why login failed, user does not exist or wrong password

        if(r){
          this.openSnackBarSubject.next("Login successful");

          setTimeout( () => this.router.navigate(['/']), 1000);

        }else{
          this.openSnackBarSubject.next("Error, login failed");
          this.form.controls.login.enable();
          this.form.controls.password.enable();
          this.loading = false;

        }

      });

    }else{
      this.openSnackBarSubject.next("Error, invalid data in form");
      this.form.controls.login.enable();
      this.form.controls.password.enable();

    }
  }

}
