import {TodoDB, TodoItem} from "/database/database.ts";
import {zValidator} from '@hono/zod-validator';
import {z} from "zod";
import { Hono } from 'hono';
import {TodoEnv} from './index.ts'
/*

UPDATE
    body : {text, itemId}

auth will authenticate and then include the userID in the context through
middleware.
*/

const updateBodySchema = z.object({itemId : z.number(), value : z.string()});
const updateValidator = zValidator('json', updateBodySchema);

function UpdateTodo(userid : number, itemid : number, text : string) : Promise<TodoItem | null>
{
    return TodoDB.updateOne( (item) => 
        {return item.itemId === itemid && item.userId === userid;}, 
        (item) => 
        {
            item.text = text;
            return item;
        });
}


//chaining is necessary for rpc to infer the types correctly.
const router = new Hono<TodoEnv>().put( '/', updateValidator,
    async (ctx) => 
    {
        const {itemId, value} = ctx.req.valid('json');
        const userId = ctx.var.userId;
        return ctx.json(await UpdateTodo(userId, itemId, value));
    })


export default router;
