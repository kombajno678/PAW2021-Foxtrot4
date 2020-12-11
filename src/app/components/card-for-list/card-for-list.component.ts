
import { Component, Input, OnInit } from '@angular/core';
import { ListCard } from 'src/app/models/ListCard';

import { BoardList } from 'src/app/models/BoardList';

import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';


import { ChangeValueComponent } from 'src/app/components/dialogs/change-value/change-value.component';
import { MatDialog } from '@angular/material/dialog';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { Board } from 'src/app/models/Board';
import { CardComponent } from '../dialogs/card/card.component';

@Component({
  selector: 'app-card-for-list',
  templateUrl: './card-for-list.component.html',
  styleUrls: ['./card-for-list.component.css']
})
export class CardForListComponent implements OnInit {

  @Input()
  card: ListCard;
  @Input()
  board: Board;
  @Input()
  list: BoardList;

  color: string;

  constructor(
    public dialog: MatDialog,

    private boardsService: BoardsService,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.color = this.card.labels
  }

  displayDueDate(): string {
    return new Date(this.card.due_date).toISOString().substr(5, 5);
  }
  refreshCard() {
    this.boardsService.getCard(this.board, this.list, this.card.id).subscribe(r => {

      this.color = r.labels
    })
  }
  onCardNameClick(list: BoardList, card: ListCard) {
    let dialogRef = this.dialog.open(CardComponent, { width: '100%', data: { board: this.board, list: list, card: card } },);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshCard();
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

