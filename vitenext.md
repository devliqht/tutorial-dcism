# Hosting a web application like Vite or Next.js
Hosting modern JavaScript frameworks like **Vite** or **Next.js** on the DCISM web server (`web.dcism.org`) isn’t as simple as uploading static files or PHP. These frameworks often need a running server, which requires some extra steps on DCISM’s setup. Through debugging, I found that `Vite` and `Next.js` don’t work out of the box with the server’s Apache proxy, but a custom Node.js server with `PM2` can get your app live.

## Build your app
Assuming you already have a Vite, NextJS or anything equivalent setup in your subdomain folder, build your app with:
```bash
npm run build
```
For Vite:
- Creates a `dist/` folder with your app’s static files (e.g., index.html, assets/).

For Next:
- Outputs a `.next/` folder or static files if using next export.

## Setup a custom Node.js server
Since **Vite**’s preview and **Next.js**’s built-in servers didn’t play nice with **Apache**, create a simple `Node.js` server to serve your files.

### Create `server.cjs`
In your subdomain folder (e.g., `~/your-subdomain.dcism.org/`), add this file:

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Handle single-page apps (SPAs) like Vite or Next.js
  if (!ext && req.url !== '/favicon.ico') {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// Bind to all interfaces (not just localhost)
server.listen(51920, '0.0.0.0', () => console.log('Server on 51920'));
```

This script serves your `dist/` files, sets proper `MIME` types (fixing Vite’s errors), and binds to `0.0.0.0` so Apache can reach it.

## Configure apache proxy (`.htaccess`)
See [Node.js hosting](/node.md) section of the proxy file. Place the `.htaccess` file in the root of your subdomain folder.

### Create `.htaccess`
```apache
RewriteEngine on
RewriteRule (.*) http://127.0.0.1:51920%{REQUEST_URI} [P,L]
```

## Run and persist with `PM2`
PM2 is a `Node.js` package for managing `Node.js` applications on a server. It’s like a wrapper for your app, making sure it keeps running, restarts if it crashes, and can even start up again after a server reboot (if with `sudo` permissions, but we **don't** have that here).

The DCISM server doesn’t natively support Vite or Next.js servers, so we used a custom `Node.js` script (server.cjs). We run that script with `PM2`.

### Install `PM2` if not already
```bash
npm install pm2
```

### Start the server
```bash
npx pm2 start server.cjs --name "my-app"
```

### Save the server
```bash
npx pm2 save
```

Your app should now load on your subdomain link (`your-subdomain.dcism.org`). If the server reboots, you will need to manually start this PM2 process again. But, if your app is the one that crashed, it would restart immediately.

## DCISM Server Limitation
The DCISM web server can’t reliably run **SSR** or **dynamic apps** (like full Next.js or Nuxt.js). When I tried Vite’s preview server or Next.js’s runtime, Apache’s proxy returned `503` Service Unavailable errors. This might be because these frameworks bind to `localhost` (not reachable by Apache), mishandle **MIME** types, or need complex server logic that clashes with DCISM’s Apache setup. Static files with a custom `Node.js` server (like this script) work best, so stick to static exports for compatibility.

Likewise, if you don't want to create the `server.cjs` script, you could always run `npm run build` first and just copy all the files from the build folder out to the root directory, allowing the server to serve it as [static files](/static.md).