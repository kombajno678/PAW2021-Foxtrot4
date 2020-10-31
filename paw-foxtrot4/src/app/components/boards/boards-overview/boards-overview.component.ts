import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
