# Getting Started

In order to start hosting web applications using the `dcism.org` web server, you first need to access your admin panel https://admin.dcism.org/.

Use the credentials you set for your **DCISM** account (the one you use when you login to DCISM computers).

#### Home Page of [DCISM Admin Panel](https://admin.dcism.org)
![HOME PAGE](/home.png)


## Enable SSH and SFTP

To access your files and execute CLI commands, you must enable SSH and SFTP protocol on your web server. 

![SSH](/ssh.png)

![SFTP](/sftp.png)

The password to your SSH and SFTP clients is the same password you used to login to the admin panel.

### SSH Command
```bash
ssh -p22077 sUSC_ID@web.dcism.org
```

Replace `USC_ID` with your USC ID, in my case it's `s22103604@web.dcism.org`.

## Accessing SFTP File Server
Once SSH and SFTP are enabled on your `dcism.org` web server, you can connect to the SFTP file server to upload, download, or manage your web application files. Follow these steps to access it using an SFTP client.

### Install an SFTP Client
An SFTP client is required in order to establish connection and sync with the SFTP file server. Below are some SFTP client recommendations:
1. **FileZilla** (cross-platform, free) `recommended`
2. **WinSCP** (Windows, free)
3. **Cyberduck** (macOS/Windows, free)

### Configure your SFTP Connection
In your SFTP client, establish a connection with the SFTP server. Note: It varies from client to client on how to establish a connection, below is an example for FileZilla client users:

![FILEZILLA](/filezilla.png)

- Host: `web.dcism.org`
- Port: `22077`
- Username: Your USC ID (e.g., `s22103604`)
- Password: The same password used for the admin panel and SSH
- Protocol: Select `SFTP` (not `FTP`)

After connecting, you should now be able to see your remote file directory, with all personal files that you've uploaded and [subdomains](/subdomains.md) you created.

![FILEZILLA_REMOTE](/filezilla_remote.png)