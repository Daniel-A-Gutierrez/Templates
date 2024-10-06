import { Hono } from "hono";
import { z } from 'zod';
import {zValidator} from '@hono/zod-validator';
import {setCookie } from 'hono/cookie';
import {login} from './index.ts';
import type { AuthInfoEnv } from 'src/router/auth/index.ts';
//basic bearer auth


const loginSchema = z.object({username : z.string(), password : z.string()});
const loginValidator = zValidator('json', loginSchema);
const router = new Hono<AuthInfoEnv>().put('/login', loginValidator, async (ctx) => 
    {
        const {username, password} = ctx.req.valid('json');
        const session = await login(username, password);
        if (session == null) { return ctx.text("Authentication Failed.", 401);}
        setCookie(ctx, 'session-key', session.key, {httpOnly : true}); // use secure if you support https
        return ctx.text('');
    });

export default router;