import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'paw-foxtrot4';
  user:any;

  constructor(private authService:AuthService) {
    
    this.authService.user.subscribe(u => {
      this.user = u;
    })
    
  }

  ngOnInit(){
    this.authService.user.subscribe(u => {
      this.user = u;
    })
  }
  
}
