import {TodoDB, TodoItem} from "/database/database.ts";
import type {TodoEnv} from './index.ts';
import {zValidator} from '@hono/zod-validator';
import {z} from "zod";
import { Hono } from 'hono';

/*

DELETE
    /[itemId]
    delete a todo item from a user's list.
    returns the id of the deleted item.


auth will authenticate and then include the userID in the context through
middleware.
*/
const deleteParamSchema = z.object({itemId : z.string()});
const deleteValidator = zValidator('param', deleteParamSchema);

function DeleteTodo(userid : number, itemid : number) : Promise<TodoItem | null>
{
    return TodoDB.deleteOne( (item) => 
        {
            return item.itemId === itemid && 
            item.userId === userid;
        });
}

const router = new Hono<TodoEnv>().delete( '/:itemId', deleteValidator, 
    async (ctx) => 
    {
        const userId = ctx.var.userId;
        const {itemId} = ctx.req.valid('param');
        const result = await DeleteTodo(userId, parseInt(itemId));
        if (result == null) {return ctx.json({message : "Item Not Found"}, 404)}
        return ctx.json(result);
    });

export default router;
