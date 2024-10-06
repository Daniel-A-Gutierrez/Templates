import {Database} from "aloedb";

export interface TodoItem 
{
    userId : number,
    itemId : number,
    text : string
};

export interface User
{
    userId : number,
    username : string,
    salt : string,
    pwHash : string
};

export const TodoDB = new Database<TodoItem>('./database/todos.json');
export const UserDB = new Database<User>('./database/users.json');
