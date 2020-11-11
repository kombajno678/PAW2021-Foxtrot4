import { ListCard } from './ListCard';

export class BoardList {

    id: number;

    list_name: string;

    archived: boolean;

    position: number;

    board_id?: number;

    //created_at

    cards?: ListCard[];


    constructor(name: string, position: number) {
        this.list_name = name;
        this.position = position;
        this.archived = false;
        this.cards = [];
    }



}