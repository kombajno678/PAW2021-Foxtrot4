import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  id:number;
  board:Board;

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

  constructor(private router:Router, private route:ActivatedRoute, private boardsService:BoardsService, private snackbar:SnackbarService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.id = p.id;
      this.update();
    })

  }

  update(){
    this.boardsService.getBoard(this.id).subscribe(board =>{
      this.board = board;
    })
  }

  onBackClick(){
    this.router.navigate(['/allboards']);

  }

  getListsSorted(){
    return this.lists.sort((a, b)=>a.position - b.position);
  }

  onArchiveClick(){
    this.boardsService.archiveBoard(this.board).subscribe(r =>{
      if(r){
        console.log('board archived');
        this.snackbar.openSnackBar('Board archived');

        this.board = r;
      }else{
        console.error('error while archiving board');
        this.snackbar.openSnackBar('Error while archiving board');

      }
    })
  }

  onActivateClick(){
    this.boardsService.restoreBoard(this.board).subscribe(r =>{
      if(r){
        console.log('board restored');
        this.snackbar.openSnackBar('Board restored');
        this.board = r;
      }else{
        console.error('error while restoring board');
        this.snackbar.openSnackBar('Error while restoring board');

      }
    })

  }

}
