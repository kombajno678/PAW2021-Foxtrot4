import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TestService } from 'src/app/services/test/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {

  list = [];

  form: FormGroup;

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'operation'];
  dataSource;

  constructor(
    private testService: TestService,
    private fb: FormBuilder) {


  }

  ngOnInit(): void {

    this.form = this.fb.group({
      firstName: new FormControl(null, [Validators.required], []),
      lastName: new FormControl(null, [Validators.required], []),
      email: new FormControl(null, [Validators.required], [])
    })


    this.update();
  }

  update() {
    this.testService.get().subscribe(r => {
      console.log('received data: ', r);
      this.list = r;
      this.dataSource = r;

    })
  }

  onSendButtonClick() {
    // console.log(this.form.get('key').value, this.form.get('value').value);
    this.testService.put({ firstName: this.form.get('firstName').value, lastName: this.form.get('lastName').value, email: this.form.get('email').value }).subscribe(r => {
      console.log('sent', r);
      this.update();
    });
  }

  deleteObj(obj) {

    this.testService.delete(obj).subscribe(r => {
      this.update();
    });

  }

}
