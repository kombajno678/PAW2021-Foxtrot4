import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface RenameDialogData {
  msg: string;
  value: string | number;
}


@Component({
  templateUrl: './change-value.component.html',
  styleUrls: ['./change-value.component.css']
})
export class ChangeValueComponent implements OnInit {

  msg: string;
  value: string | number;

  form: FormGroup;



  constructor(public dialogRef: MatDialogRef<ChangeValueComponent>, @Inject(MAT_DIALOG_DATA) public data: RenameDialogData) {
    this.msg = data.msg;
    this.value = data.value;

  }

  ngOnInit(): void {

    this.form = new FormGroup({
      value: new FormControl(this.value ? this.value : null, [Validators.required]),
    })


  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.controls.value.value);
    }


  }

  onCancel() {

    this.dialogRef.close(null);


  }

}
