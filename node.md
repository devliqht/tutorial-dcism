# Node.js hosting
Since the DCISM web server has JS runtimes built-in such as Node and Bun, you can easily start a Node.js application. Please note that Node.js applications hosted on the DCISM web server listen to ports ranging from `51920` - `51929`.

## Configuring Proxy
Every **node.js** app deployed on the DCISM web server requires to have a proxy filed named `.htaccess` to be placed in the root directory of your subdomain folder. The contents of this file `.htaccess` depends whether or not you want to use the `HTTP` protocol or the `HTTPS` protocol. If you don't need to transfer credentials and private data within your Node.js app, you can use the `HTTP` protocol, otherwise use the `HTTPS` protocol.

To create an `.htaccess` file, you can create a new file inside the SFTP client or do `nano .htaccess` to open the Nano text editor inside the SSH shell.

#### HTTP: `.htaccess`
```apache
RewriteEngine on
RewriteRule (.*) http://127.0.0.1:51920%{REQUEST_URI} [P,L]
```
#### HTTPS: `.htaccess`
```apache
RewriteEngine on
RewriteCond %{REQUEST_SCHEME} !https
RewriteRule (.*) https://127.0.0.1:51920%{REQUEST_URI} [R=301,L]

RewriteRule (.*) http://127.0.0.1:51920%{REQUEST_URI} [P,L]
```

#### Here is an example file structure for a Node.js app (`Vite`):
```text {2}
~/your-subdomain.dcism.org/
├── .htaccess              # Apache config to proxy requests to Node.js
├── dist/                  # Vite build output (static files)
│   ├── assets/            # Compiled assets (JS, CSS, images)
│   │   ├── index-abc123.js
│   │   ├── styles-xyz789.css
│   │   └── logo-123.png
│   └── index.html         # Main entry point
├── src/                   # Vite source files (development)
├── public/                # Static assets copied to dist/
├── vite.config.ts         # Vite configuration
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Dependency lock file
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config (if used)
└── node_modules/          # Node.js dependencies
```
## Creating a simple Node.js app
#### test.cjs
```js 
// test.cjs
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from test server</h1>');
});
server.listen(51920, () => console.log('Server on 51920'));
```
#### .htaccess
```apache
RewriteEngine on
RewriteRule (.*) http://127.0.0.1:51920%{REQUEST_URI} [P,L] # 51920 Port!
```

::: warning NOTE
Make sure that the port in the `.htaccess` file is the same port you're using for your Node.js application.
:::
```bash
node test.cjs
```

#### Expected Output:
```bash
s22103604@web:~/your-subdomain.dcism.org$: node test.cjs
Server on 51920
```

Likewise, when opening `your-subdomain.dcism.org`, it should also output `Hello from test server`.

![HELLO](/hello.png)

#### Or, when doing curl `localhost:51920`
```bash
s22103604@web:~$: curl localhost:51920
<h1>Hello from test server</h1>
s22103604@web:~$:
```