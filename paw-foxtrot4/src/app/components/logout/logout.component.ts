import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService:AuthService, private router: Router) {
    this.authService.logout();
    setTimeout(()=>this.router.navigate(['/']), 100);
    

  }

  ngOnInit(): void {
  }

}
