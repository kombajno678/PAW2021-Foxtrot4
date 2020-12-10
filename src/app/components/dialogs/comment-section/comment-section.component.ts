import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';



/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-comment-section',
  styleUrls: ['comment-section.component.css'],
  templateUrl: 'comment-section.component.html',
})
export class CommentSectionComponent implements OnInit{
  @Input()
  allComments: Observable<Comment[]>;
  listOfComments: Comment[];
  constructor(){
    
  
  }
  ngOnInit(): void {
    this.allComments.subscribe(r =>{
      console.log("sub")
      console.log(r)
      this.listOfComments = r;
    })
  }
 
  displayedColumns: string[] = ['posted_at', 'comment'];
  
}