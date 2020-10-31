import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {


  exampleCard = {
    name:'cardName',
    content:'fasdfasd fasd fasd fhjas dufirhkjfdhvkdfh vfld',
  }

  lists = [
    {
      name: 'xd',
      position: 3,
      cards:[],
      archived:false,
    },
    {
      name: 'hello',
      position: 1,
      cards:[this.exampleCard, this.exampleCard, this.exampleCard],
      archived:false,
    },
    {
      name: 'world',
      position: 2,
      cards:[this.exampleCard],
      archived:false,
    },
    {
      name: 'world123',
      position: 5,
      cards:[this.exampleCard, this.exampleCard, this.exampleCard, this.exampleCard],
      archived:false,
    },
    {
      name: 'world321',
      position: 4,
      cards:[this.exampleCard, this.exampleCard, this.exampleCard],
      archived:false,
    },

  ]

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onBackClick(){
    this.router.navigate(['/allboards']);

  }

  getListsSorted(){
    return this.lists.sort((a, b)=>a.position - b.position);
  }

}
