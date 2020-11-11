import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Board } from 'src/app/models/Board';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit {

  @Input()
  board: Board;

  @Output()
  onBoardOpen: EventEmitter<Board>;

  @Output()
  onBoardArchive: EventEmitter<Board>;

  @Output()
  onBoardActivate: EventEmitter<Board>;

  @Output()
  onBoardDelete: EventEmitter<Board>;

  @Output()
  onBoardCreate: EventEmitter<null>;


  form: FormGroup;


  constructor() {
    this.onBoardOpen = new EventEmitter<Board>();
    this.onBoardArchive = new EventEmitter<Board>();
    this.onBoardActivate = new EventEmitter<Board>();
    this.onBoardCreate = new EventEmitter<null>();
    this.onBoardDelete = new EventEmitter<Board>();
  }

  ngOnInit(): void {
  }

  onOpenClick() {
    this.onBoardOpen.emit(this.board);
  }

  onArchiveClick() {
    this.onBoardArchive.emit(this.board);
  }

  onActivateClick() {
    this.onBoardActivate.emit(this.board);

  }

  onCreateClick() {
    this.onBoardCreate.emit();
  }

  onDeleteClick() {
    console.log('delete emit');
    this.onBoardDelete.emit(this.board);
  }

}
