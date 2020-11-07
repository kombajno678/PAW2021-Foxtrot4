import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from 'src/app/models/Board';
import { BoardList } from 'src/app/models/BoardList';
import { ListCard } from 'src/app/models/ListCard';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  id: number;
  board: Board;

  exampleLists: BoardList[];

  constructor(private router: Router, private route: ActivatedRoute, private boardsService: BoardsService, private snackbar: SnackbarService) {
    this.exampleLists = [];
    this.exampleLists.push(new BoardList('asd', 1));
    this.exampleLists.push(new BoardList('qwe', 2));
    this.exampleLists.push(new BoardList('rty', 3));
    //this.exampleLists.push(new BoardList('ghj', 4));

    this.exampleLists.forEach(l => {
      l.cards.push(new ListCard('randomCard', 'asdasdasdasdasdasdasdasd'));
      l.cards.push(new ListCard('randomCard 2', 'asdasdasdasdasdasdasdasd'));
      l.cards.push(new ListCard('randomCard 3', 'asdasdasdasdasdasdasdasd'));
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.id = p.id;
      this.update();
    })

  }

  update() {
    this.boardsService.getBoard(this.id).subscribe(board => {
      this.board = board;
      //get lists
      this.board.lists = this.exampleLists;;
    })
  }

  dropList(event: CdkDragDrop<BoardList[]>) {
    console.log('dropList : ', event);
    this.board.lists[event.previousIndex].position = event.currentIndex + 1;
    this.board.lists[event.currentIndex].position = event.previousIndex + 1;
    moveItemInArray(this.board.lists, event.previousIndex, event.currentIndex);
  }

  dropCard(event, list: BoardList) {
    console.log('dropCard : ', event);
    moveItemInArray(list.cards, event.previousIndex, event.currentIndex);


  }



  onBackClick() {
    this.router.navigate(['/allboards']);

  }

  getListsSorted() {
    return this.board.lists.sort((a, b) => a.position - b.position);
  }

  onArchiveClick() {
    this.boardsService.archiveBoard(this.board).subscribe(r => {
      if (r) {
        console.log('board archived');
        this.snackbar.openSnackBar('Board archived');

        this.board = r;
      } else {
        console.error('error while archiving board');
        this.snackbar.openSnackBar('Error while archiving board');

      }
    })
  }

  onActivateClick() {
    this.boardsService.restoreBoard(this.board).subscribe(r => {
      if (r) {
        console.log('board restored');
        this.snackbar.openSnackBar('Board restored');
        this.board = r;
      } else {
        console.error('error while restoring board');
        this.snackbar.openSnackBar('Error while restoring board');

      }
    })

  }

}
