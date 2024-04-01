export class Note {
    public id: number=0;
    public title: string = "";
    public labels: string[] | undefined;
    public userId: number[] | undefined;
    public subtasks: {title:string, completed:boolean}[] | undefined;
    public isArchived: boolean = false;
    public isTrashed: boolean = false;
}
