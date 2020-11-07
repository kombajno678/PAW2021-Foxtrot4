export class ListCard {

    card_title: string;
    content: string;
    archived: boolean;
    position: number;

    //created_at

    //attachements[]

    //labels[]

    //users_assigned[]

    //task_lists[]

    //activities[]

    //due_date:Date

    //cover

    constructor(title: string, content: string, position: number) {
        this.card_title = title;
        this.content = content;
        this.position = position;
        this.archived = false;
    }

}