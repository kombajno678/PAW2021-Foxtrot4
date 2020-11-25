
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/Board';
import { BoardList } from 'src/app/models/BoardList';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';


import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';

import { CreateBoardDialogComponent } from 'src/app/components/boards/create-board-dialog/create-board-dialog.component';
import { ChangeValueComponent } from 'src/app/components/dialogs/change-value/change-value.component';

import { CardComponent } from 'src/app/components/dialogs/card/card.component';
import { ListCard } from 'src/app/models/ListCard';
import { BoardComponent } from 'src/app/pages/board/board.component';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input()
  list: BoardList;
  @Input()
  board: Board;
  @Input()
  allBoards$: Observable<Board[]>;
  @Output("dropCard")
  dropCard: EventEmitter<any>;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private snackbar: SnackbarService) {
    this.dropCard= new EventEmitter< any>();  
    
  }

  ngOnInit(): void {
  }





  dropCardList(list){
    this.dropCard.emit(list);
    
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

  onListRenameClick(list: BoardList) {


    //open dialog for creating new operation
    let dialogRef = this.dialog.open(ChangeValueComponent, { width: '300px', data: { msg: 'Rename list', value: list.list_name } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_name: string = result;
        let old_name = list.list_name;
        list.list_name = new_name;

        this.boardsService.updateBoard(this.board).subscribe(r => {
          if (r) {
            this.snackbar.openSnackBar('List renamed to: ' + new_name);
          } else {
            this.snackbar.openSnackBar('Error!');
            list.list_name = old_name;
          }
        })
      }
    })


  }


  setListArchivedState(list: BoardList, archivedState: boolean) {
    let old_state = list.archived;
    list.archived = archivedState;
    this.boardsService.updateList(this.board, list).subscribe(r => {
      if (r) {
        this.snackbar.openSnackBar('List ' + list.archived ? 'archived' : 'restored');
      } else {
        this.snackbar.openSnackBar('Error');
        list.archived = old_state;
      }
    })
  }



  onListDeleteClick(list) {

    if (confirm('Are You sure?')) {

      this.boardsService.deleteList(this.board, list).subscribe(r => {
        if (r) {

          this.snackbar.openSnackBar('Success');
          let index = this.board.lists.indexOf(list);
          if (index > -1) {
            this.board.lists.splice(index, 1);
          }

        } else {
          this.snackbar.openSnackBar('Error :(');
        }
      })

    }






  }













  onCardNameClick(list: BoardList, card: ListCard) {

    //open card dialog


    let dialogRef = this.dialog.open(CardComponent, { width: '100%', data: { board: this.board, list: list, card: card } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

    })




  }

  setCardArchivedState(list: BoardList, card: ListCard, archivedState: boolean) {
    let old_state = card.archived;
    card.archived = archivedState;
    this.boardsService.updateCard(this.board, list, card).subscribe(r => {
      if (r) {
        this.snackbar.openSnackBar('Card ' + (card.archived ? 'archived' : 'restored'));
      } else {
        this.snackbar.openSnackBar('Error');
        card.archived = old_state;
      }
    })
  }

  onCardRenameClick(list: BoardList, card: ListCard) {


    //open dialog for creating new operation
    let dialogRef = this.dialog.open(ChangeValueComponent, { width: '300px', data: { msg: 'Rename card', value: card.card_name } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_name: string = result;
        let old_name = card.card_name;
        card.card_name = new_name;

        this.boardsService.updateCard(this.board, list, card).subscribe(r => {
          if (r) {
            this.snackbar.openSnackBar('Card renamed to: ' + new_name);
          } else {
            this.snackbar.openSnackBar('Error!');
            card.card_name = old_name;
          }
        })
      }
    })



  }

  onNewCardClick(list: BoardList) {


    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '250px',
      data: { message: 'Enter card title', itemName: 'Card title' }
    });

    dialogRef.afterClosed().subscribe(cardName => {
      console.log('The dialog was closed, : ', cardName);
      if (cardName) {
        console.log('sending reuest ... ');
        this.boardsService.addCard(this.board, list, cardName).subscribe(createdCard => {
          if (createdCard) {
            this.snackbar.openSnackBar('Success');
            list.cards.push(createdCard);
          } else {
            this.snackbar.openSnackBar('Error :(');
          }
        })
      }
    });





  }

  onCardDeleteClick(list, card) {

    if (confirm('Are You sure?')) {
      this.boardsService.deleteCard(this.board, list, card).subscribe(r => {
        if (r) {
          this.snackbar.openSnackBar('Success');
          let index = list.cards.indexOf(card);
          if (index > -1) {
            list.cards.splice(index, 1);
          }

        } else {
          this.snackbar.openSnackBar('Error :(');
        }
      })
    }


  }

}