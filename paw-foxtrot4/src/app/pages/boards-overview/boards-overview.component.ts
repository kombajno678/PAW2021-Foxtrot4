import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/models/board';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.css']
})
export class BoardsOverviewComponent implements OnInit {

  boards:Board[] = null;


  constructor(
    private router:Router,
    private boardsService:BoardsService,
    private snackbar:SnackbarService) { }

  ngOnInit(): void {
    this.update();
  }

  update(){
    this.boardsService.getBoards().subscribe(boards =>{
      this.boards = boards;
    })
  }

  getActiveBoards():Board[]{
    return this.boards.filter(b => !b.archived);
  }
  getArchivedBoards():Board[]{
    return this.boards.filter(b => b.archived);
  }

  anyActiveBoards():boolean{
    return this.boards.find(b => !b.archived) ? true : false;
  }

  anyArchivedBoards():boolean{
    return this.boards.find(b => b.archived) ? true : false;
  }


  openBoard(event){
    console.log('user wants to open board : ', event);
    let board = event;
    this.router.navigate(['/board'], { queryParams: { id: board.id }});
  }


  onArchiveClick(event){
    let board = event;
    this.boardsService.archiveBoard(board).subscribe(r =>{
      if(r){
        console.log('board archived');
        this.snackbar.openSnackBar('Board archived');
      }else{
        console.error('error while archiving board');
        this.snackbar.openSnackBar('Error while archiving board');
      }
    })
  }

  onActivateClick(event){
    let board = event;
    this.boardsService.restoreBoard(board).subscribe(r =>{
      if(r){
        console.log('board restored');
        this.snackbar.openSnackBar('Board restored');
      }else{
        console.error('error while restoring board');
        this.snackbar.openSnackBar('Error while restoring board');
      }
    })

  }



}
