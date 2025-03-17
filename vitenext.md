# Hosting a web application like Vite or Next.js
After an ***excruciating*** debugging process and back-to-back conversation with my best friend (`Grok`), I have yet to successfully deploy a Vite or Next.js application using the DCISM web server. Here are some issues that I found:

![GROK](/grok.png)

### Proxy Issues
There is an issue with how front-end web applications are served with the current `.htaccess` settings. In my findings, I have noticed that web Applications (like Vite, Next.js with React) are ***not*** served properly on their subdomain proxy (e.g `your-subdomain.dcism.org`).

#### For example, given we have this Next.js properly configured running on the allowed port range:
![NEXTJS](/nextjs.png)

Opening our subdomain `your-subdomain.dcism.org` it would either throw out a 
- `404` NextJS not found page
- `503` Service Unavailable Page
- `404` Failed to load resources
- A `MIMP` error

But..

```bash
s22103604@web:~/your-subdomain.dcism.org$: curl localhost:51920
```
Doing a `curl` command inside the SSH shell with `localhost:51920` as the target address returns the proper HTML output that should be served by `Vite` or `Next.js`.

### Why? I have no idea.

Likewise, if I try to do this command to access `localhost:51920` remotely:
```bash
ssh -p 22077 -L 51920:localhost:51920 s22103604@web.dcism.org
```
Opening `localhost:51920` in my local machine, it returns the ***correct*** HTML output.

#### This is my output when **previewing** a Vite project with `npm run preview` on Port `51920` accessed through my local machine.
![HTML_OUTPUT](/html_output.png)

## Conclusions
- Since normal Node.js applications works (ran with `Node test.cjs` in [Node.js hosting](/node.md)), this means that the proxy is working and Node is working.
- There is really something wrong with **Vite**, **Next.js**, or any front-end framework in general that the web server cannot process.

## Workarounds
Instead of hosting a web application with `npm run dev` or `preview` (launches a `Vite dev server` or `NextJS dev server`), you can just build your application (with `npm run build` or equivalent), get its static files (HTML, CSS, JS) and put that on the root directory of your subdomain.

**For example**, Next.JS builds are usually stored in the `out/` folder in your directory, you can execute an mv command to move them out:
```bash
mv out/* .
```
This is assuming that when you are executing this command, you are at the `root` directory. 

Moving the static files out will let the web server host them as [static files](/static.md), instead of using the proxy logic. Also make sure to ***delete*** the `.htaccess` file if you do it this way, or else the server will try to serve your website as a `Node.js` application instead of a static one.