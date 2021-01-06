import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {


  user: any;

  constructor(private authService: AuthService, private jwt: JwtHelperService) {
    this.authService.userSubject.asObservable().subscribe(u => {
      this.user = this.jwt.decodeToken(u);

    })
  }

  ngOnInit(): void {
  }

}
