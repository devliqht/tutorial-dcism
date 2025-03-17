# Subdomains
Subdomains are created by accessing your [admin control panel](https://admin.dcism.org/). You can create up to `10` subdomains, and subdomain naming are on a **first come first serve** basis.

## Creating a Subdomain
A subdomain is a custom name added before the base domain `dcism.org`. For example, in `tutorial.dcism.org`:
- `tutorial` is the **subdomain**.
- `dcism.org` is the **domain**.

To create one:
1. Log in to your [admin panel](https://admin.dcism.org/) with your DCISM credentials.
2. Navigate to the subdomain section.
3. Enter your desired subdomain name (e.g., `tutorial`).
4. Save your changes. If the name is available, it will be created as `subdomain.dcism.org`.
   
::: warning NOTE
- Subdomain names must be unique across all `dcism.org` users.
:::

![SUBDOMAINS](/subdomains.png)

Once a subdomain is created, it also creates a folder in your remote file directory named after your subdomain. You can use this folder to upload files, or use [Git Version Control](https://git-scm.com/) in order to manage folders and files.

![TUTORIAL_DIRECTORY](/tutorial_directory.png)