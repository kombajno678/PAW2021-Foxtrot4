import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {


  public snackBarDefaultAction:string = "Close";
  public snackBarDefaultDuration:number = 3000;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  public openSnackBarFunction(message: string, action?: string, duration?:number) {
    this._snackBar.open(message, action ? action : this.snackBarDefaultAction, {
      duration: duration ? duration : this.snackBarDefaultDuration,
    });
  }

  handleChildEvent(event){
    this.openSnackBarFunction(event);
  }

}
