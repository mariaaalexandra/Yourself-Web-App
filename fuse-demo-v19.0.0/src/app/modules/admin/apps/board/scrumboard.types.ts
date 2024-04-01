export interface IBoard
{
    id?: number | null;
    title: string;
    description?: string | null;
    icon?: string | null;
    lastActivity?: string | null;
    lists?: IList[];
    labels?: ILabel[];
    members?: IMember[];
}

export interface IList
{
    id?: number | null;
    boardId: number;
    position: number;
    title: string;
    cards?: ICard[];
}

export interface ICard
{
    id?: number | null;
    boardId: number;
    listId: number;
    position: number;
    title: string;
    description?: string | null;
    labels?: ILabel[];
    dueDate?: string | null;
}

export interface IMember
{
    id?: string | null;
    name: string;
    avatar?: string | null;
}

export interface ILabel
{
    id: string | null;
    boardId: string;
    title: string;
}
