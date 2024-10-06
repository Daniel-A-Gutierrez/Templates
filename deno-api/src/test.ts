import {hc} from 'hono/client';
import { AppType } from 'src/main.ts';
import {assert} from '@std/assert';
import type { TodoItem } from '../database/database.ts';

//i can see why the hc wouldn't store cookies by default - it may be proxying requests from 
//clients so thatd be bad.



Deno.test( "Running Client Tests", async (test) => 
{
    let client = hc<AppType>( 'http://127.0.0.1:8000/'  ); 
    await test.step("Creating Test User" , async () => 
    {
        const req = {json : {username : "test", password : "password3"}};
        const response = await client.newuser.$put( req );
        assert(response.status === 201 || response.status === 451, 
                `Creating user failed unexpectedly : ${await response.text()}`);
    });

    await test.step("Logging In", async () => 
    {
        const req = {json : {username : "test", password : "password3"}};
        const res = await client.login.$put(req);
        assert(res.status === 200, `Logging in failed, ${await res.text()}`);
        const session_key = res.headers.getSetCookie()[0];
        client = hc<AppType>('http:/127.0.0.1:8000' , {headers : {Cookie : `${session_key}`}});
    });

    async function readTodos()
    {
        const res = await client.todo.gettodos.$get();
        assert(res.status==200, "Getting Todos Failed");
        const todos = await res.json();
        console.log(todos.map(item => item.text).join("\n"));
    }

    await test.step("Reading Todo List", async () => 
    {
        await readTodos();
    });

    let testTodos : TodoItem[] = [];
    await test.step("Creating Todos", async () => 
    {
        const res1 = await client.todo.createtodo.$post({json:{text:"Thing One"}});
        const res2 = await client.todo.createtodo.$post({json:{text:"Thing Two"}});
        const res3 = await client.todo.createtodo.$post({json:{text:"Thing Three"}});
        assert(res1.status === res2.status &&
            res2.status === res3.status && 
            res1.status === 200 , `Creating todo items failed :, ${res1}, ${res2}, ${res3}`); 
        res1.body?.cancel(); res2.body?.cancel(); res3.body?.cancel();
        const res = (await client.todo.gettodos.$get());
        assert(res.status==200, "Getting Created Todos Failed");
        testTodos = await res.json();
        const todoItems = testTodos.map(item => item.text);
        assert( JSON.stringify(todoItems) === 
                JSON.stringify(["Thing One", "Thing Two", "Thing Three"]) , 
                `Returned todos didnt match what was created: ${todoItems}`);
        await readTodos();
    });

    await test.step("Updating Todos", async () => 
    {
        for(let i = 0 ; i < testTodos.length; i++)
        {
            const todo = testTodos[i];
            const req = {json:{itemId : todo.itemId, value : todo.text.toLowerCase() }};
            const res = await client.todo.updatetodo.$put(req);
            assert(res.status === 200, `Failed to update todo: ${await res.text()}`);
            const get_res = await client.todo.gettodos.$get();
            assert(res.status === 200, "Failed to get updated todos");
            const new_todos = await get_res.json();
            assert(new_todos[i].text === testTodos[i].text.toLowerCase());
            testTodos = new_todos;
        }
        await readTodos();
    });

    const addedItems : TodoItem[] = [];
    await test.step("Benchmark - add 1000 todos" , async () => 
    {
        for(let i = 0 ; i < 1000 ; i++)
        {
            const res = await client.todo.createtodo.$post({json:{text:`${i}`}});
            const todo = await res.json();
            addedItems.push(todo);
        }
    });

    await test.step("Cleanup" , async () => 
    {
        for(let i = 0 ; i < addedItems.length ; i++)
        {
            const todo = addedItems[i];
            const req = {param:{itemId:todo.itemId.toString()}};
            const res = await client.todo.deletetodo[':itemId'].$delete(req);
            if(res.status !== 200) { `Failed to cleanup item ${todo.itemId}.;` }
            await res.body?.cancel();
        }
        for(let i = 0 ; i < testTodos.length ; i++)
        {
            const todo = testTodos[i];
            const req = {param:{itemId:todo.itemId.toString()}};
            const res = await client.todo.deletetodo[':itemId'].$delete(req);
            if(res.status !== 200) { `Failed to cleanup item ${todo.itemId}.;` }
            await res.body?.cancel();
        }
        await readTodos();
    });

} );