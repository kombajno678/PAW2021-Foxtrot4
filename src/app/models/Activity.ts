import { ActivityAction, ActivityDescription } from './ActivityDescription';
import { Board } from './Board';
import { BoardList } from './BoardList';
import { ListCard } from './ListCard';

export enum ActivitySubject {
    BOARD,
    LIST,
    CARD,
    COMMENT
}
export class Activity {
    id?: number;

    //what was changed
    board_id?: number;
    list_id?: number;
    card_id?: number;
    comment_id?: number;

    //who changed
    user_id?: number;
    username?: string;

    //what action
    description: ActivityDescription;

    created_at?:string; //ISO date + time + Z

    board?: Board;
    list?: BoardList;
    card?: ListCard;
    subjectname?:string;

/*
    getSubject(): ActivitySubject {
        return Activity.getSubject(this);

    }
*/
    static getSubject(activity): ActivitySubject {
        if (activity.board_id && !activity.list_id && !activity.card_id && !activity.comment_id) {
            return ActivitySubject.BOARD;
        }
        if (activity.board_id && activity.list_id && !activity.card_id && !activity.comment_id) {
            return ActivitySubject.LIST;
        }
        if (activity.board_id && !activity.list_id && activity.card_id && !activity.comment_id) {
            return ActivitySubject.CARD;
        }
        if (activity.board_id && !activity.list_id && !activity.card_id && activity.comment_id) {
            return ActivitySubject.COMMENT;
        }
    }

}
