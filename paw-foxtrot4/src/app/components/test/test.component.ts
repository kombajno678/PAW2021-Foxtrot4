import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test/test.service';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {


  list = [];


  key:number;
  value:string;



  constructor(private testService:TestService) { }

  ngOnInit(): void {
    this.update();
  }

  update(){
    this.testService.get().subscribe(r =>{
      console.log('received data: ', r);
      this.list = r;

    })
  }

  onSendButtonClick(){
    console.log(this.key, this.value);
    this.testService.put([{key: this.key, value: this.value}]).subscribe(r =>{
      console.log('sent', r);
      this.update();
    });

  }

  deleteObj(obj){

    this.testService.delete(obj).subscribe(r =>{
      this.update();
    });

  }

}
