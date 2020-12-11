import { Comment } from './Comment';
export class ListCard {

    id: number;

    card_name: string;
    content?: string;
    archived: boolean;
    position: number;
    list_id?: number;
    comments: Comment[];
    labels: string;

    //created_at

    //attachements[]

    //labels[]

    //users_assigned[]

    //task_lists[]

    //activities[]

    due_date: Date | string;
    completed: boolean;

    //cover

    constructor(
        id: number,
        title: string,
        content: string,
        position: number,
        archived: boolean,
        list_id: number,
        comments: Comment[],
        labels: string,
        due_date?: Date | string,
        completed?: boolean,
    ) {
        this.id = id;
        this.card_name = title;
        this.content = content;
        this.position = position;
        this.archived = archived;
        this.list_id = list_id;
        this.comments = comments;
        this.labels = labels;
        this.due_date = due_date ? due_date : null;
        this.completed = completed ? completed : null;
    }

}