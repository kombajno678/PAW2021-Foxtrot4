import { BoardList } from './BoardList';

export class Board {
    id: number;
    board_name: string;
    last_open: any;
    visibility: any;
    archived: boolean;

    read: boolean;
    write: boolean;
    execute: boolean;

    color?: number;//not yet in backend

    lists?: BoardList[];

    constructor(
        id: number,
        board_name: string,
        last_open: any,
        visibility: any,
        archived: boolean,
        read: boolean,
        write: boolean,
        execute: boolean,
        color: number,
    ) {

        this.id = id;
        this.board_name = board_name;
        this.last_open = last_open;
        this.visibility = visibility;
        this.archived = archived;
        this.read = read;
        this.write = write;
        this.execute = execute;
        this.color = color;

    }

}