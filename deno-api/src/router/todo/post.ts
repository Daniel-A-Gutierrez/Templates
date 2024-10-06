import {TodoDB, TodoItem} from "/database/database.ts";
import {zValidator} from '@hono/zod-validator';
import {z} from "zod";
import { Hono } from 'hono';
import type {TodoEnv} from './index.ts';
/*
POST
    route params 
    body : {text : string}
    add a todo item to the list.
    returns the todo item as json.

auth will authenticate and then include the userID in the context through
middleware.
*/
const schema = z.object({text : z.string()});
const validator = zValidator('json', schema);

let itemCounter = await TodoDB.count();
function CreateTodo(userId : number, text : string)  : Promise<TodoItem>
{
    const x = itemCounter;
    itemCounter += 1;
    return TodoDB.insertOne( {userId, text, itemId : x });
}

const router = new Hono<TodoEnv>().post( '/', validator,
    async (ctx) => 
    {
        const userId = ctx.var.userId;
        const text = ctx.req.valid('json').text;
        return ctx.json(await CreateTodo(userId, text));
    })

export default router;
