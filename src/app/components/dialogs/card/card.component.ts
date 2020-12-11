import { Component, ChangeDetectorRef, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/models/Board';
import { BoardList } from 'src/app/models/BoardList';
import { Comment } from '../../../models/Comment'
import { ListCard } from 'src/app/models/ListCard';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { ListComponent } from '../../list/list.component';
import { BehaviorSubject, Observable } from 'rxjs';




export interface CardDialogData {
  board: Board;
  list: BoardList;
  card: ListCard;
}
export interface Color {
  id: Number,
  bgcolor: String,
  choosed: Boolean
}


@Component({
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {



  board: Board;
  list: BoardList;
  card: ListCard;
  allComments: BehaviorSubject<Comment[]>;
  listOfComments: Comment[];
  changeDetectorRefs: ChangeDetectorRef;
  allColors: Color[];

  form: FormGroup;
  formComment: FormGroup;
  formDueDate: FormGroup;

  displayedColumns: string[] = ['color'];
  colorOfCard: string;


  constructor(
    public dialogRef: MatDialogRef<CardComponent>,

    @Inject(MAT_DIALOG_DATA) public data: CardDialogData,
    private service: BoardsService,
    private snackbar: SnackbarService) {
    this.allColors = [
      { id: 1, bgcolor: "", choosed: true },
      { id: 2, bgcolor: "#ff5757", choosed: false },
      { id: 3, bgcolor: "#57dbff", choosed: false },
      { id: 4, bgcolor: "#f5ff57", choosed: false },
      { id: 5, bgcolor: "#76ff57", choosed: false },
    ]

    this.displayedColumns = ["bgcolor"]
    this.allComments = new BehaviorSubject<Comment[]>([]);
    this.board = data.board;
    this.list = data.list;
    this.card = data.card;




    this.formDueDate = new FormGroup({
      due_date: new FormControl(this.card.due_date, [Validators.required]),
      completed: new FormControl(this.card.completed ? this.card.completed : false, [Validators.required]),
    })
    this.formComment = new FormGroup({
      content: new FormControl(null, [Validators.required]),
    })
    this.form = new FormGroup({
      content: new FormControl(this.card.content ? this.card.content : '', []),
    })


  }


  ngOnInit(): void {
    this.dialogRef.beforeClosed()
    this.allColors.find(r =>
      r.bgcolor == this.card.labels

    ).choosed = true;
    this.allColors.find(r =>
      r.bgcolor != this.card.labels

    ).choosed = false;
    this.update();
  }

  update() {

    this.colorOfCard = this.card.labels;
    this.service.getComments(this.card).subscribe(r => {
      this.listOfComments = r;
      this.allComments.next(this.listOfComments);
      console.log(this.allComments);
    })

  }
  saveColor(color: string) {
    console.log(color)
    this.service.updateColor(this.card, color).
      subscribe(r => {
        if (r) {
          this.card = r
          this.colorOfCard = this.card.labels;
          this.allColors.find(s =>
            s.bgcolor == r.labels

          ).choosed = true;

          this.allColors.filter(s =>
            s.bgcolor != r.labels

          ).forEach(element => {
            element.choosed = false;
          });

          console.log(this.allColors)
        }
      })
  }
  saveComment() {
    if (this.formComment.valid) {
      this.service.addComment(new Comment(null, this.formComment.controls.content.value, null, this.card.id))
        .subscribe(r => {
          console.log(r)
          if (r) {
            this.formComment.controls.content.setValue("");
            this.snackbar.openSnackBar('Comment added!');
            r.posted_at = new Date(r.posted_at)
            this.listOfComments.push(r);
            this.allComments.next(this.listOfComments);
          } else {
            this.snackbar.openSnackBar('Error while saving comment :(');
          }
        })
    }
  }


  onFormDueDateSubmit() {
    console.log("onFormDueDateSubmit");

    if (this.formDueDate.valid) {


      this.card.due_date = new Date(this.formDueDate.controls.due_date.value);
      this.card.completed = this.formDueDate.controls.completed.value;

      this.service.updateCard(this.board, this.list, this.card).subscribe(r => {
        console.log("onFormDueDateSubmit result = ", r);
        if (r) {
          this.snackbar.openSnackBar('Due date saved!');
        } else {
          this.snackbar.openSnackBar('Error while saving date :(');
        }
      })

    }


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
