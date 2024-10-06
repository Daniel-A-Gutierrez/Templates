import { Hono, Env } from "hono";
import { crypto } from "@std/crypto";
import { z, string, ParseStatus } from 'zod';
import { UserDB } from '/database/database.ts';
import {zValidator} from '@hono/zod-validator';
import {setCookie, deleteCookie} from 'hono/cookie';
import {validator} from 'hono/validator';
import {createFactory} from 'hono/factory';
//basic bearer auth
interface AuthInfoEnv extends Env
{
    Variables : {session : Session}
}

type Session = 
{
    key : string, 
    userId : number, 
    start : Temporal.Instant 
};

let sessions = new Map<string, Session>();

const router = new Hono<AuthInfoEnv>();
const factory = createFactory<AuthInfoEnv>();

function Login(username : string, password : string) : Session {}
const loginSchema = z.object({username : z.string(), password : z.string()});
const loginValidator = zValidator('json', loginSchema);
router.put('/login', loginValidator, async (ctx) => 
{
    const {username, password} = ctx.req.valid('json');
    const session = await Login(username, password);
    setCookie(ctx, 'session-key', session.key, {httpOnly : true}); // use secure if you support https
    return ctx.text('');
});


function CreateUser(username : string, password : string) {}
const newUserSchema = z.object({username : z.string(), password : z.string()});
const newUserValidator = zValidator('json', newUserSchema);
router.put('/new-user', newUserValidator, async (ctx) => 
{
    const {username, password} = ctx.req.valid('json');
    await CreateUser(username,password);
    return ctx.text('User Created');
});



const bearerAuthValidator = factory.createMiddleware( async (ctx, next) => 
{
    const key = ctx.req.header('session-key');
    if (key == null) return ctx.text('No Session-Key Header Present', 401);
    const session = sessions.get(key);
    if (session == null) return ctx.text('Invalid Session Key');
    ctx.set('session', session);
    await next();
});

router.use(bearerAuthValidator);

function Logout(sessionKey : string) : {ok : boolean} {}
router.put('/logout', async (ctx) => 
{
    const session = ctx.var.session;
    let status = await Logout(session.key);
    if( !status.ok ) {return ctx.text('Session Key Not Found', 401);}
    deleteCookie(ctx, 'session-key');
    return ctx.text('Logged Out');
});



export default router;