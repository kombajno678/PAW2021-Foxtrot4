import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateBoardDialogComponent } from 'src/app/components/boards/create-board-dialog/create-board-dialog.component';
import { Board } from 'src/app/models/Board';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.css']
})
export class BoardsOverviewComponent implements OnInit {

  boards: Board[] = null;


  constructor(
    private router: Router,
    private boardsService: BoardsService,
    private snackbar: SnackbarService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.update();
  }

  update() {
    this.boardsService.getBoards().subscribe(boards => {
      this.boards = boards;
    })
  }

  getActiveBoards(): Board[] {
    return this.boards.filter(b => !b.archived);
  }
  getArchivedBoards(): Board[] {
    return this.boards.filter(b => b.archived);
  }

  anyActiveBoards(): boolean {
    return this.boards.find(b => !b.archived) ? true : false;
  }

  anyArchivedBoards(): boolean {
    return this.boards.find(b => b.archived) ? true : false;
  }



  deleteBoard(event) {
    console.log('user wants to delete board : ', event);
    let board: Board = event;

    this.boardsService.deleteBoard(board).subscribe(r => {
      console.log('deleteBoard result = ', r);;
      if (r) {
        this.snackbar.openSnackBar(`Board "${r.board_name}" has been deleted!`);
        this.update();
      } else {
        this.snackbar.openSnackBar('There has been an error while deleting board :(');
      }
    })
  }

  createBoard(event) {
    console.log('user wants to create new board');
    //open dialog

    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '250px',
      data: { message: 'Enter board name', itemName: 'Board name' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed, : ', result);
      if (result) {
        console.log('sending reuest ... ');
        let tempBoard = new Board();
        tempBoard.board_name = result;
        tempBoard.visibility = 'yes';
        this.boardsService.addBoard(tempBoard).subscribe(r => {
          console.log('addBoard result = ', r);;
          if (r) {
            this.snackbar.openSnackBar(`Board "${r.board_name}" has been created!`);
            this.update();
          } else {
            this.snackbar.openSnackBar('There has been an error while crating a new board :(');
          }
        })
      }
    });
  }

  openBoard(event) {
    console.log('user wants to open board : ', event);
    let board: Board = event;
    this.router.navigate(['/board'], { queryParams: { id: board.id } });
  }

  onArchiveClick(event) {
    let board: Board = event;
    this.boardsService.archiveBoard(board).subscribe(r => {
      if (r) {
        console.log('board archived');
        this.snackbar.openSnackBar('Board archived');
      } else {
        console.error('error while archiving board');
        this.snackbar.openSnackBar('Error while archiving board');
      }
    })
  }

  onActivateClick(event) {
    let board: Board = event;
    this.boardsService.restoreBoard(board).subscribe(r => {
      if (r) {
        console.log('board restored');
        this.snackbar.openSnackBar('Board restored');
      } else {
        console.error('error while restoring board');
        this.snackbar.openSnackBar('Error while restoring board');
      }
    })

  }

}
