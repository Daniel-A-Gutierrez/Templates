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
const deleteParamSchema = z.object({itemId : z.number()});
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
        const userId = 0;
        const {itemId} = ctx.req.valid('param');
        return ctx.json(await DeleteTodo(userId, itemId));
    });

export default router;
