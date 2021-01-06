import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Activity, ActivitySubject } from 'src/app/models/Activity';
import { ActivityDescription } from 'src/app/models/ActivityDescription';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { BoardsService } from 'src/app/services/boards/boards.service';
import { UserService } from 'src/app/services/user/user.service';

export interface ActivityDialogData {
  board_id: number;
}

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.css']
})
export class ActivityDialogComponent implements OnInit {

  board_id: number;

  public boardActivities$: BehaviorSubject<Activity[]> = new BehaviorSubject(null);

  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityDialogData,
    private activitiesService: ActivityService,
    private userService: UserService,
    private boardsService: BoardsService

  ) {
    this.board_id = data.board_id;
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {

    this.activitiesService.getAll(this.board_id).subscribe(r => {
      if (r) {
        r.forEach(a => {
          //get subject
          /*
          switch (Activity.getSubject(a)) {
            case ActivitySubject.BOARD:
              this.boardsService.getBoard(a.board_id).subscribe(r => {
                //a.board = r;
                a.subjectname = r.board_name;
              });
              break;
            case ActivitySubject.LIST:
              this.boardsService.getListByID(a.board_id, a.list_id).subscribe(r => {
                //a.list = r;
                a.subjectname = r.list_name;
              });
              break;
            case ActivitySubject.CARD:
              this.boardsService.getCardById(a.card_id).subscribe(r => {
                a.subjectname = r.card_name;
              });
              break;
          };*/

          this.boardActivities$.next(r.sort((a, b) => {
            return b.created_at.localeCompare(a.created_at);
          }));
          


        });
      }


    })
  }


  getActivityDesc(a: Activity): string {
    return `${a.user_id} ${Activity.getSubject(a)} ${ActivityDescription.toString(a.description)}`;
  }

  /*
  export enum ActivitySubject {
    BOARD,
    LIST,
    CARD,
    COMMENT
}
*/

  getDate(a: Activity) {
    //let d: Moment = moment(a.created_at);
    let d: Date = new Date(a.created_at);
    return d.toLocaleDateString() + ' : ' + d.toLocaleTimeString();


  }
  getIconBySubject(a: Activity) {
    switch (Activity.getSubject(a)) {
      case ActivitySubject.BOARD:
        return 'content_paste';
      case ActivitySubject.LIST:
        return 'list';
      case ActivitySubject.CARD:
        return 'credit_card';
      case ActivitySubject.COMMENT:
        return 'comment';
      default:
        return 'category';

    }
  }

  getSubject(a: Activity) {
    switch (Activity.getSubject(a)) {
      case ActivitySubject.BOARD:
        return 'BOARD';
      case ActivitySubject.LIST:
        return 'LIST';
      case ActivitySubject.CARD:
        return 'CARD';
      case ActivitySubject.COMMENT:
        return 'COMMENT';
      default:
        return '?';

    }
  }

  getAction(a: Activity) {
    return ActivityDescription.toString(a.description);
  }

}
