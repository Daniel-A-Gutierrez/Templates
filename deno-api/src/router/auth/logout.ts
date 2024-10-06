import {deleteCookie} from 'hono/cookie';
import {logout} from './index.ts';
import { AuthInfoEnv } from 'src/router/auth/index.ts';
import { Hono } from 'hono';


const router = new Hono<AuthInfoEnv>().put('/logout', async (ctx) => 
{
    const session = ctx.var.session;
    const status = await logout(session.key);
    if( !status.ok ) {return ctx.text('Session Key Not Found', 401);}
    deleteCookie(ctx, 'session-key');
    return ctx.text('Logged Out');
});


export default router;