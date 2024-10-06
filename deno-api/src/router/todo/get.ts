import { TodoDB, TodoItem } from "/database/database.ts";
import type { TodoEnv } from './index.ts';
import { Hono } from 'hono';
/*
GET 
    /
    get all todos associated with a userID
    in the future do auth stuff

auth will authenticate and then include the userID in the context through
middleware.
*/
function GetUserTodos(userid : number) : Promise<TodoItem[]>
{
    return TodoDB.findMany( (item) => item.userId === userid);
}

const route = new Hono<TodoEnv>().get( async (ctx) => 
    { 
        const userId = ctx.var.userId; //the 'base' and 'parent' stuff is for the sake of this.
        const todos = await GetUserTodos(userId);
        return ctx.json(todos);
    });

    
export default route;
