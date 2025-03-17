# PHP Hosting
Hosting PHP works as is and the same as [static website hosting](/static.md), however if you want to incorporate database access, there is a 'special' way to acess your database:

#### config.php
```php {title="config.php"}
<?php 
    define("DB_HOST", "localhost:3306");
    define("DB_USER", "s22103604_chiase");
    define("DB_PASS", "password_here");
    define("DB_NAME", "s22103604_chiase");
?>
```

As you can see, our `DB_HOST` is `localhost:3306`. The reason for that is, this PHP code is already running on the web server, thus accessing localhost will return the address of the server itself. The `:3306` specifies the port for MySQL that is set on the DCISM web server, which is the default port for database connections. 

![LOCALHOST](/localhost3306.png)

The `DB_USER` AND `DB_NAME` is tied to your database name that you set on the [admin control panel](https://admin.dcism.org). The `DB_USER` is **NOT** only your USC ID (s22103604) but rather the name of your database as a whole. I don't know why, but yeah.

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

## Developer Note
From experience, you cannot remotely access the database outside of your subdomain/outside of the web server. This is because localhost:3306 returns a **loopback address** (`127.0.0.1`) to your **own** machine/server. Accessing localhost on your local machine will find a database on YOUR local machine, not the server. I also tried setting the `DB_HOST` to `dbadmin.dcism.org` in the hopes that I could access my database remotely (and even from the web server itself), but to no avail.

### So, how then?
As of now, I have **not seen a way** to access the database you created in the DCISM web servers ***remotely***. A tedious workaround I do is I export my local database and import it to my database in the DCISM [phpmyadmin](https://dbadmin.dcism.org). Please note that there are also other methods such as creating a script for syncing or configuring phpmyadmin to allow live sync/remote access, but they require administrator permissions. So, in my case, I have this `config.php` file:

#### config.php
```php
<?php 
    //define("DB_HOST", "localhost:3306");
    //define("DB_USER", "s22103604_chiase");
    //define("DB_PASS", "password");
    //define("DB_NAME", "s22103604_chiase");
    define("DB_HOST", "localhost");
    define("DB_USER", "root");
    define("DB_PASS", "");
    define("DB_NAME", "chiase");
?>
```
I have to **comment** and **uncomment** these 4 define variables, essentially ***switching*** between my local database and my DCISM database, whichever I need. When developing, I use my **local database**. If I see that my current development stage is ready for production testing, I switch my `config.php` file to utilize the DCISM database, export my local database, import it to the DCISM web server, and then save and commit changes. ***Phew.***
