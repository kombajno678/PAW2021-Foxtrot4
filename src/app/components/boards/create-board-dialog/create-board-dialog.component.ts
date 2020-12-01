import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CreateDialogData {
  message: string,
  itemName: string
}

@Component({
  selector: 'app-create-board-dialog',
  templateUrl: './create-board-dialog.component.html',
  styleUrls: ['./create-board-dialog.component.css']
})
export class CreateBoardDialogComponent implements OnInit {


  item: string;


  constructor(
    public dialogRef: MatDialogRef<CreateBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData) {

  }


  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}