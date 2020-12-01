import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  defaultAction: string = 'Close';
  defaultDuration:number = 3000;

  defaulsCssClasses:string[] = [];

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message:string, action?:string):MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, action ? action : this.defaultAction, {
      duration: this.defaultDuration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: this.defaulsCssClasses,
    });
  }

  dismiss(){
    this._snackBar.dismiss();
  }



}
