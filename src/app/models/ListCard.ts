export class ListCard {

    id: number;

    card_name: string;
    content?: string;
    archived: boolean;
    position: number;
    list_id?: number;

    //created_at

    //attachements[]

    //labels[]

    //users_assigned[]

    //task_lists[]

    //activities[]

    //due_date:Date

    //cover

    constructor(id: number, title: string, content: string, position: number, archived: boolean, list_id: number) {
        this.id = id;
        this.card_name = title;
        this.content = content;
        this.position = position;
        this.archived = archived;
        this.list_id = list_id;
    }

}