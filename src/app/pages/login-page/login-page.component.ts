import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {


  public snackBarDefaultAction: string = "Close";
  public snackBarDefaultDuration: number = 3000;

  tab: number = 0;


  constructor(private _snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.route.queryParams.subscribe(p => {
      if (p.tab >= 0) {
        this.tab = p.tab;
      }
    })


  }

  public openSnackBarFunction(message: string, action?: string, duration?: number) {
    this._snackBar.open(message, action ? action : this.snackBarDefaultAction, {
      duration: duration ? duration : this.snackBarDefaultDuration,
    });
  }

  handleChildEvent(event) {
    this.openSnackBarFunction(event);
  }

}
