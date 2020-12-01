import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/models/Board';
import { BoardList } from 'src/app/models/BoardList';
import { ListCard } from 'src/app/models/ListCard';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';




export interface CardDialogData {
  board: Board;
  list: BoardList;
  card: ListCard;
}


@Component({
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  board: Board;
  list: BoardList;
  card: ListCard;


  form: FormGroup;



  constructor(
    public dialogRef: MatDialogRef<CardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CardDialogData,
    private service: BoardsService,
    private snackbar: SnackbarService) {

    this.board = data.board;
    this.list = data.list;
    this.card = data.card;

    this.form = new FormGroup({
      content: new FormControl(this.card.content ? this.card.content : '', []),
    })


  }

  ngOnInit(): void {
  }


  onSave() {
    if (this.form.valid) {

      let old_content = this.card.content;
      this.card.content = this.form.controls.content.value;


      this.service.updateCard(this.board, this.list, this.card).subscribe(r => {
        console.log(r);
        if (r) {
          this.snackbar.openSnackBar('Content saved!');

        } else {
          this.snackbar.openSnackBar('Error while saving content :(');
          this.card.content = old_content;
        }
      })


    }


  }

  onClose() {

    this.dialogRef.close(null);


  }


}
