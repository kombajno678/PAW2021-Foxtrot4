
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/Board';
import { BoardList } from 'src/app/models/BoardList';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';


import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';

import { CreateBoardDialogComponent } from 'src/app/components/boards/create-board-dialog/create-board-dialog.component';
import { ChangeValueComponent } from 'src/app/components/dialogs/change-value/change-value.component';





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


  constructor(
    public dialog: MatDialog,
    private boardsService: BoardsService,
    private snackbar: SnackbarService) {


  }

  ngOnInit(): void {
  }







  dropCard(event: CdkDragDrop<BoardList>) {
    console.log(event);
    console.log("tu")
    let listsToUpdate: BoardList[] = [];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.cards, event.previousIndex, event.currentIndex);
      listsToUpdate.push(event.container.data);
    } else {
      transferArrayItem(event.previousContainer.data.cards,
        event.container.data.cards,
        event.previousIndex,
        event.currentIndex);
      listsToUpdate.push(event.container.data);
      listsToUpdate.push(event.previousContainer.data);
    }




    listsToUpdate.forEach(list => {
      list.cards.forEach((d, i, a) => {
        //if (d.position !== i + 1 || d.list_id !== list.id || listsToUpdate.length > 1) {
        d.position = i + 1;
        d.list_id = list.id;
        this.boardsService.updateCard(this.board, null, d).subscribe(r => console.log(r));
        //}
      })
    });



    //TODO: send updated positions




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















}
