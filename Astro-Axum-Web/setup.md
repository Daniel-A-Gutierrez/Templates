1. made a git repo with rust gitignore
2. open with vs code
3. initialize new rust project cargo new 
4. add dependencies in axum sandbox
5. new folder in project root, make astro project following instructions on their github
	5a. create astro@latest
6. npx astro add svelte --optional
7. npm i flamethrower-router
8. go to layout.astro and add the import lines 

	<script>import flamethrower from 'flamethrower-router';
	flamethrower({ prefetch: 'visible', log: true, pageTransitions: true });</script>
   to the layout.astro file's head.


and some extensions too
npx astro add mdx
// npx astro add image
// npm i p5
// npm i --save-dev @types/p5 


#### Frontend
https://github.com/denoland/deno-astro-adapter
going to try updating this to use deno.

