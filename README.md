# KingDragons (KD) - The Gamified Learning Kingdom

Welcome, my liege, to the source code of your digital kingdom. This document contains the sacred instructions to summon, run, and manage your application.

## Prerequisites

Before you can bring the kingdom to life, you must have these tools on your Windows machine:

1.  **Node.js**: The magical energy that powers the kingdom. Download and install it from [nodejs.org](https://nodejs.org/).
2.  **Git**: The Royal Scribe's tool for tracking and managing code. Download and install it from [git-scm.com](https://git-scm.com/).
3.  **A Code Editor**: A tool like [Visual Studio Code](https://code.visualstudio.com/) is highly recommended.

---

## Part 1: Summoning the Kingdom (Initial Setup)

Follow these steps in your terminal (you can use Command Prompt, PowerShell, or the terminal inside VS Code).

**1. Clone the Kingdom's Code:**
First, you must retrieve the code from its repository.

```bash
git clone https://github.com/ksnprogrammer/KD.git
```

**2. Enter the Kingdom's Directory:**
Navigate into the newly created folder.

```bash
cd KD
```

**3. Install All Dependencies:**
This single command will automatically install all the necessary magical components (packages) for the kingdom to function.

```bash
npm install
```

**4. Run the Kingdom:**
This command starts the local development server.

```bash
npm run dev
```

Once you see a "ready" message in your terminal, your kingdom is running! You can access it in your web browser at: **[http://localhost:9002](http://localhost:9002)**

---

## Part 2: Exposing Your Kingdom to the World (Optional)

You wished for a public link to your kingdom running on your local machine. We can achieve this with a tool called **Cloudflare Tunnel**.

**1. Install Cloudflare Tunnel:**
Follow the official Cloudflare guide to install `cloudflared` on your Windows machine: [Install cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/installation/).

**2. Authenticate Cloudflare:**
Open a new terminal and run this command. It will open a browser window asking you to log in to Cloudflare and authorize the tunnel.

```bash
cloudflared tunnel login
```

**3. Create and Run the Tunnel:**
While your application is still running (from `npm run dev` in the other terminal), run the following command in your new terminal. This will create a secure, public link directly to your local server.

```bash
cloudflared tunnel --url http://localhost:9002
```

Your terminal will display a public URL ending in `.trycloudflare.com`. It will look something like this:

`https://your-random-tunnel-name.trycloudflare.com`

**This is the link you can use to access your KD system from anywhere in the world!**

---

## Part 3: Managing the Kingdom

*   **To Stop the Kingdom:** Press `Ctrl + C` in the terminal where you ran `npm run dev`.
*   **To Stop the Public Link:** Press `Ctrl + C` in the terminal where you ran `cloudflared tunnel`.
*   **Pushing Your Changes to GitHub:** To save your changes to the GitHub repository, you can use these commands:
    ```bash
    git add .
    git commit -m "A new decree from the King"
    git push origin main
    ```
