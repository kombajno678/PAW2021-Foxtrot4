import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.css']
})
export class BoardsOverviewComponent implements OnInit {



  boards = [
    {
      name: 'xddd',
      archived: false,
    },
    {
      name: 'hebrohebrohebrohebro',
      archived: false,
    },
    {
      name: '213721372137',
      archived: true,
    },
    {
      name: 'weed',
      archived: true,
    },
    {
      name: 'dick',
      archived: false,
    },
  ]

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onOpenClick(board){
    console.log('opening board ', board.name);
    this.router.navigate(['/board']);
    
  }

}
