import { BoardList } from './BoardList';

export class Comment {
    id: number;
    content: string;
    posted_at: string | Date;
    card_id: number;
  
    constructor(
        id: number,
        content: string,
        posted_at: string | Date,
        card_id: number,
       
    ) {

        this.id = id;
        this.content = content;
        this.posted_at = posted_at;
        this.card_id = card_id;

    }

}