import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateBoardDialogComponent } from 'src/app/components/boards/create-board-dialog/create-board-dialog.component';
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

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private snackbar: SnackbarService) {
    this.exampleLists = [];
    this.exampleLists.push(new BoardList('asd', 1));
    this.exampleLists.push(new BoardList('qwe', 2));
    this.exampleLists.push(new BoardList('rty', 3));
    //this.exampleLists.push(new BoardList('ghj', 4));

    this.exampleLists.forEach(l => {
      l.cards.push(new ListCard('randomCard 1', 'card from ' + l.list_name, 1));
      l.cards.push(new ListCard('randomCard 2', 'card from ' + l.list_name, 2));
      l.cards.push(new ListCard('randomCard 3', 'card from ' + l.list_name, 3));
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
      if (this.board) {
        this.boardsService.getLists(this.board).subscribe(lists => {
          this.board.lists = lists;
          this.board.lists.forEach(list => {
            this.boardsService.getCards(this.board, list).subscribe(cards => {
              list.cards = cards;
            })
          })
        });
      } else {
        console.error('this.board = null');
        this.snackbar.openSnackBar('Could not load this board :(');
      }
    })
  }

  dropList(event: CdkDragDrop<BoardList[]>) {
    console.log('dropList : ', event);
    this.board.lists[event.previousIndex].position = event.currentIndex + 1;
    this.board.lists[event.currentIndex].position = event.previousIndex + 1;
    moveItemInArray(this.board.lists, event.previousIndex, event.currentIndex);
    //TODO: send updated positions

  }

  dropCard(event: CdkDragDrop<BoardList[]>) {
    console.log(event);



    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((d, i, a) => d.position = i + 1);
    } else {

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      event.container.data.forEach((d, i, a) => d.position = i + 1);

      event.previousContainer.data.forEach((d, i, a) => d.position = i + 1);
    }
    //TODO: send updated positions
  }



  onBackClick() {
    this.router.navigate(['/allboards']);

  }

  getListsSorted() {
    return this.board.lists ? this.board.lists.sort((a, b) => a.position - b.position) : [];
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




  onNewListClick() {


    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '250px',
      data: { message: 'Enter list name', itemName: 'List name' }
    });

    dialogRef.afterClosed().subscribe(listName => {
      console.log('The dialog was closed, : ', listName);
      if (listName) {
        console.log('sending reuest ... ');
        this.boardsService.addList(this.board, listName).subscribe(createdList => {
          if (createdList) {
            this.snackbar.openSnackBar('Success');
            createdList.cards = [];
            this.board.lists.push(createdList);
          } else {
            this.snackbar.openSnackBar('Error :(');
          }
        })
      }
    });
  }

  onListDeleteClick(list) {
    this.boardsService.deleteList(this.board, list).subscribe(r => {
      if (r) {

        this.snackbar.openSnackBar('Success');
        let index = this.board.lists.indexOf(list);
        if (index > -1) {
          this.board.lists.splice(index, 1);
        }

      } else {
        this.snackbar.openSnackBar('Error :(');
      }
    })



  }

  onNewCardClick(list: BoardList) {


    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '250px',
      data: { message: 'Enter card title', itemName: 'Card title' }
    });

    dialogRef.afterClosed().subscribe(cardName => {
      console.log('The dialog was closed, : ', cardName);
      if (cardName) {
        console.log('sending reuest ... ');
        this.boardsService.addCard(this.board, list, cardName).subscribe(createdCard => {
          if (createdCard) {
            this.snackbar.openSnackBar('Success');
            list.cards.push(createdCard);
          } else {
            this.snackbar.openSnackBar('Error :(');
          }
        })
      }
    });





  }

  onCardDeleteClick(list, card) {

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
