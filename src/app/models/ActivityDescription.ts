export enum ActivityAction{
    CREATED,
    UPDATED,
    DELETED,
    ARCHIVED,
    RESTORED
}



export class ActivityDescription{
    action:ActivityAction;
    static toString(a:ActivityDescription){
        switch(a.action){
            case ActivityAction.CREATED:
                return 'created';
            case ActivityAction.UPDATED:
                return 'updated';
            case ActivityAction.DELETED:
                return 'deleted';
            case ActivityAction.ARCHIVED:
                return 'archived';
            case ActivityAction.RESTORED:
                return 'restored';
            default:
                return '?';
            
        }
    }
}