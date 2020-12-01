import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateBoardDialogComponent } from 'src/app/components/boards/create-board-dialog/create-board-dialog.component';
import { ChangeValueComponent } from 'src/app/components/dialogs/change-value/change-value.component';
import { Board } from 'src/app/models/Board';
import { BoardList } from 'src/app/models/BoardList';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { Observable } from 'rxjs';
import { moveListToAnotherBoardEvent } from 'src/app/components/list/list.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  id: number;
  board: Board;
  allBoards$: Observable<Board[]>;

  colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private snackbar: SnackbarService) {

  }

  changeBoardColor(color: number = 0) {
    this.board.color = color
    this.boardsService.updateBoard(this.board).subscribe(r => {
      if (r && r.color === this.board.color) {
        this.snackbar.openSnackBar('Color changed!');
      } else {
        this.snackbar.openSnackBar('Error!');
      }
    })

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.id = p.id;
      this.update();
    })

  }

  update() {

    this.allBoards$ = this.boardsService.getBoards();


    this.boardsService.getBoard(this.id).subscribe(board => {
      this.board = board;

      //get lists
      if (this.board) {
        this.boardsService.getLists(this.board).subscribe(lists => {
          this.board.lists = lists;
          if (lists) {
            // get cards
            this.board.lists.forEach(list => {
              this.boardsService.getCards(this.board, list).subscribe(cards => {
                if (cards) {
                  list.cards = cards;
                } else {
                  console.error('cards = null', this.board, list);
                  this.snackbar.openSnackBar('Could not load cards of list "' + list.list_name + '" :(');
                }
              })
            })
          } else {
            console.error('lists = null', this.board);
            this.snackbar.openSnackBar('Could not load lists of this board :(');
          }

        });
      } else {
        console.error('this.board = null');
        this.snackbar.openSnackBar('Could not load this board :(');
      }
    })
  }

  moveListToAnotherBoard(event: moveListToAnotherBoardEvent) {

    let oldBoardId = event.list.board_id;
    event.list.board_id = event.targetBoard.id;
    this.boardsService.updateList(event.sourceBoard, event.list).subscribe(r => {
      console.log('moveListToAnotherBoard result = ', r);
      if (r) {
        console.log('success');
        this.update();
      } else {
        console.log('fail');
        event.list.board_id = oldBoardId;
      }
    })

  }

  dropList(event: CdkDragDrop<BoardList[]>) {
    console.log('dropList : ', event);
    event.container
    //console.log('before: ', this.board.lists);
    ///this.board.lists[event.previousIndex].position = event.currentIndex + 1;
    ///this.board.lists[event.currentIndex].position = event.previousIndex + 1;
    moveItemInArray(this.board.lists, event.previousIndex, event.currentIndex);
    event.container.data.forEach((list, i, lists) => {

      if (list.position !== i + 1) {
        list.position = i + 1;
        this.boardsService.updateList(this.board, list).subscribe(r => {
          console.log('update list result = ', r);
        });
      }


    });


  }




  onBackClick() {
    this.router.navigate(['/allboards']);

  }

  getListsSorted() {
    return this.board.lists ? this.board.lists.sort((a, b) => a.position - b.position) : [];
  }

  onArchiveClick() {

    this.board.archived = true;
    this.boardsService.updateBoard(this.board).subscribe(r => {
      if (r) {
        this.snackbar.openSnackBar('Board archived');
      } else {
        this.snackbar.openSnackBar('Error while archiving board');
        this.board.archived = false;
      }
    })

  }

  onActivateClick() {

    this.board.archived = false;
    this.boardsService.updateBoard(this.board).subscribe(r => {
      if (r) {
        this.snackbar.openSnackBar('Board restored');
      } else {
        this.snackbar.openSnackBar('Error while restoring board');
        this.board.archived = true;
      }
    })


  }


  onRenameClick() {

    //open dialog for creating new operation
    let dialogRef = this.dialog.open(ChangeValueComponent, { width: '300px', data: { msg: 'Rename board', value: this.board.board_name } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_name: string = result;
        let old_name = this.board.board_name;
        this.board.board_name = new_name;

        this.boardsService.updateBoard(this.board).subscribe(r => {
          if (r) {
            this.snackbar.openSnackBar('Board renamed to: ' + new_name);
          } else {
            this.snackbar.openSnackBar('Error!');
            this.board.board_name = old_name;
          }
        })
      }
    })


  }




  onNewListClick() {


    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '250px',
      data: { message: 'Enter list name', itemName: 'List name' }
    });

    dialogRef.afterClosed().subscribe(listName => {
      console.log('The dialog was closed, : ', listName);
      if (listName) {
        console.log('sending reuest ... ');
        this.boardsService.addList(this.board, listName).subscribe(createdList => {
          if (createdList) {
            this.snackbar.openSnackBar('Success');
            createdList.cards = [];
            this.board.lists.push(createdList);
          } else {
            this.snackbar.openSnackBar('Error :(');
          }
        })
      }
    });
  }





}
