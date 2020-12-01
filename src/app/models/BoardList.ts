import { ListCard } from './ListCard';

export class BoardList {

    id: number;

    list_name: string;

    archived: boolean;

    position: number;

    board_id?: number;

    //created_at

    cards?: ListCard[];


    constructor(id: number, name: string, position: number, archived: boolean, board_id: number) {
        this.id = id;
        this.list_name = name;
        this.position = position;
        this.archived = archived;
        this.board_id = board_id;
        this.cards = [];
    }



}