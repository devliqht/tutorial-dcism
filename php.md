# PHP Hosting
Setting up a PHP website on the DCISM web server is straightforward, it works just like hosting a [static site](/static.md) (e.g., plain HTML). You upload your PHP files to your subdomain folder (like `~/your-domain.dcism.org/`), and they’ll run automatically. If you want your PHP site to use a database, though, you’ll need to connect it to the DCISM MySQL database. Here’s how to do that when your site is running on the server itself, and what to do if you want to access that database from your own computer.

## Accessing the Database
![LOCALHOST](/localhost3306.png)

The DCISM MySQL database runs on the same server as your website, listening on port `3306` (the standard MySQL port). If your PHP app is already hosted on `web.dcism.org`, connecting to the database is simple: you just need a configuration file to tell PHP where to find it.

#### config.php
```php {title="config.php"}
<?php 
    define("DB_HOST", "localhost:3306");      // The database is on the same server, port 3306
    define("DB_USER", "s22103604_chiase");    // Your database username
    define("DB_PASS", "your_password_here");  // Your database password
    define("DB_NAME", "s22103604_chiase");    // Your database name
?>
```
- **DB_HOST** is set to `localhost:3306` because the database is on the same server as your PHP app (`web.dcism.org`). The `:3306` part specifies the port MySQL uses.
- **DB_USER** and **DB_NAME** match what you set up in your [admin control panel](/databases.md) (e.g., `s22103604_chiase` in my case). These are usually the same for simplicity.
- **DB_PASS** is your password. Replace `your_password_here` with the real one.

Here’s the tricky part: the setup above only works when your PHP app is running on the DCISM web server. If you try to run the same app on your own computer (locally) with that `config.php`, it won’t connect. Why? Because `localhost` on your computer means ***your*** computer, not `web.dcism.org`, and you probably don’t have a database named **s22103604_chiase** running locally on port `3306`. Plus, the DCISM database isn’t set up to accept connections from outside the server, no external address like `db.dcism.org` is provided.

To solve this and work with the DCISM database from your local machine (e.g., for development), you need to create a bridge between your computer and the server. This bridge is called an **SSH tunnel**.

## Creating the SSH Tunnel
An SSH tunnel lets you securely “**forward**” a port from your local machine to the server. In this case, you’ll make your computer’s port(s) (e.g., `3306`, `3307`..) connect to the server’s MySQL port (`3306`). Once the tunnel is active, your local app can talk to the DCISM database as if it were running on the server.

In order to create an SSH tunnel, we must port forward port `:3306` so we can access it in our local machine. The command for that is:

```bash
ssh -v -p 22077 -L 3306:localhost:3306 s22103604@web.dcism.org
```

::: warning NOTE
Replace `s22103604@web.dcism.org` with your own username. The first port `3306` specifies an open port in your local machine, and the second `3306` is the server's port.
:::

The `-v` argument enables "**verbose**" mode where it shows debug information about the SSH connection. If ever port `3306` is not open in your machine, change it to any port that is available. In most cases, the port after, `3307` is usually free.

### Example Error (Port `3306` is in use)
```bash
debug1: Local forwarding listening on ::1 port 3306.
bind [::1]:3306: Address already in use
debug1: Local forwarding listening on 127.0.0.1 port 3306.
bind [127.0.0.1]:3306: Address already in use
channel_setup_fwd_listener_tcpip: cannot listen to port: 3306
Could not request local forwarding.
```

### To fix, simply port forward it to a free port (Try `3307` first)
```bash
ssh -v -p 22077 -L 3307:localhost:3306 s22103604@web.dcism.org
```

If it is successful, it should show these debug messages:
```bash
debug1: Local connections to LOCALHOST:3307 forwarded to remote address localhost:3306
debug1: Local forwarding listening on ::1 port 3307.
debug1: Local forwarding listening on 127.0.0.1 port 3307.
debug1: Connection to port 3307 forwarding to localhost port 3306 requested.
debug1: channel 3: new direct-tcpip [direct-tcpip] (inactive timeout: 0)
```

Now that the port `:3306` is now forwarded, we can now use that in our `config.php`.

::: warning NOTE
If you changed the port from `3306` to `3307`, make sure to also change your `config.php` to utilize `localhost:3307` instead of `localhost:3306`.
:::

#### config.php if you did `-L 3307:localhost:3306`
```php {title="config.php"}
define("DB_HOST", "localhost:3307");
```

## Using the config
To use the config file, simply import it in your db connection file (or anything alternative) and declare a new `mysqli` connection.
#### db_connection.php
```php
<?php
    // Include the config file
    require_once 'config.php';

    // Create a connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check the connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    echo "Connected successfully to the database!";
    // use the $conn anywhere in your codebase...
?>
```

#### Or you can directly use it in the mysqli object (not really recommended)
```php
<?php
    // No config include

    // Create a connection
    $conn = new mysqli("localhost:3306", // DB_HOST
                        "s22103604_chiase", // DB_USER
                        "your_password", // DB_PASS
                        "s22103604_chiase"); // DB_NAME

    // Check the connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    echo "Connected successfully to the database!";
    // use the $conn anywhere in your codebase...
?>
```

## Concrete Steps on PHP Hosting
1. PHP hosting is the same as [static site](/static.md) hosting. 
2. When you need to access a database, create a `config.php` file with your define variables.
3. Set the `DB_HOST` to `localhost:3306`.
4. Set the `DB_USER` and `DB_NAME` to your database name you created on the [admin control panel](/databases.md).
5. Set the password.
6. If you want to access the database remotely for yourself, create an **SSH Tunnel.**
7. Adjust the `config.php` if you used port `3307` instead of `3306`.
8. Create a new `mysqli` connection and pass the `DB_HOST`, `DB_USER`, `DB_PASS` and `DB_NAME` as arguments. Make sure `config.php` is included through `require_once` in your file with the `mysqli` connection.
9. The database connection and PHP application should now be working.