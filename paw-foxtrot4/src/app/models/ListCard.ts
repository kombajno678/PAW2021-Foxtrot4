export class ListCard {

    card_title: string;
    content: string;
    archived: boolean;

    //created_at

    //attachements[]

    //labels[]

    //users_assigned[]

    //task_lists[]

    //activities[]

    //due_date:Date

    //cover

    constructor(title: string, content: string) {
        this.card_title = title;
        this.content = content;
        this.archived = false;
    }

}