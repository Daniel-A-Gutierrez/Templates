import {createUser, AuthInfoEnv} from './index.ts';
import {z} from 'zod';
import {zValidator} from '@hono/zod-validator';
import { Hono } from 'hono';
//basic bearer auth


const newUserSchema = z.object({username : z.string(), password : z.string()});
const newUserValidator = zValidator('json', newUserSchema);
const router = new Hono<AuthInfoEnv>().put('/new-user', newUserValidator, async (ctx) => 
{
    const {username, password} = ctx.req.valid('json');
    const new_user = await createUser(username,password);
    if (new_user) {return ctx.text('User Created', 201);}
    else {return ctx.text('Username taken', 451); }
});

export default router;