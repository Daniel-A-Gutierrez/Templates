import {UserDB, TodoDB, TodoItem} from "/database/database.ts";
import { Hono } from 'hono';
import {zValidator} from '@hono/zod-validator';
import {z} from "zod";

/*
GET 
    /
    get all todos associated with a userID
    in the future do auth stuff
POST
    route params 
    body : {text : string}
    add a todo item to the list.
    returns the todo item as json.
DELETE
    /[itemId]
    delete a todo item from a user's list.
    returns the id of the deleted item.
UPDATE
    /[itemId]

auth will authenticate and then include the userID in the context through
middleware.
*/
const app = new Hono();

const deleteParamSchema = z.object({itemId : z.number()});
const updateBodySchema = z.object({itemId : z.number(), value : z.string()});
const createBodySchema = z.object({text : z.string()});

const deleteValidator = zValidator('param', deleteParamSchema);
const updateValidator = zValidator('json', updateBodySchema);
const createValidator = zValidator('json', createBodySchema);

function GetUserTodos(userid : number) : Promise<TodoItem[]>
{
    return TodoDB.findMany( (item) => item.userId === userid);
}

let itemCounter = await TodoDB.count();
function CreateTodo(userId : number, text : string)  : Promise<TodoItem>
{
    const x = itemCounter;
    itemCounter += 1;
    return TodoDB.insertOne( {userId, text, itemId : x });
}

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

function DeleteTodo(userid : number, itemid : number) : Promise<TodoItem | null>
{
    return TodoDB.deleteOne( (item) => 
        {
            return item.itemId === itemid && 
            item.userId === userid;
        });
}

//chaining is necessary for rpc to infer the types correctly.
const router = app
.get('/', 
    async (ctx) => 
    { 
        const userId = 0;
        const todos = await GetUserTodos(userId);
        return ctx.json(todos);
    })
.post( '/', createValidator,
    async (ctx) => 
    {
        const userId = 0;
        const text = ctx.req.valid('json').text;
        return ctx.json(await CreateTodo(userId, text));
    })
.put( '/:itemId', updateValidator,
    async (ctx) => 
    {
        const {itemId, value} = ctx.req.valid('json');
        const userId = 0;
        return ctx.json(await UpdateTodo(userId, itemId, value));
    })
.delete( '/:itemId', deleteValidator, 
    async (ctx) => 
    {
        const userId = 0;
        const {itemId} = ctx.req.valid('param');
        return ctx.json(await DeleteTodo(userId, itemId));
    });

export default router;
export type AppType = typeof router;
