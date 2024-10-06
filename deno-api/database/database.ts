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


export async function GetNextTodoId() 
{
    let maxId = 0;
    await TodoDB.findOne(item => 
    {
        maxId = maxId > item.itemId ? maxId : item.itemId;
        return false;
    });
    return maxId;
}

export async function GetNextUserId() 
{
    let maxId = 0;
    await UserDB.findOne(item => 
    {
        maxId = maxId > item.userId ? maxId : item.userId;
        return false;
    });
    return maxId;
}