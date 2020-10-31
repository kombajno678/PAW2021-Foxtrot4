import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {


  user:any;

  constructor(private authService:AuthService) {
    this.authService.user.subscribe(u => {
      this.user = u;
    })
  }

  ngOnInit(): void {
  }

}
