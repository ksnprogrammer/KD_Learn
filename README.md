# KingDragons (KD) - The Royal Deployment Decree

Welcome, my liege, to the source code of your digital kingdom. This document contains the sacred instructions to summon, run, and manage your application on your own machine, turning it into the central server for your entire realm.

## Part 1: Forging the Local Kingdom

Before you begin, you must have the foundational tools installed on your Windows 10 PC. The kingdom cannot automate the installation of these base magics.

### Prerequisites
1.  **Node.js**: The magical energy that powers the kingdom. Download and install it from [nodejs.org](https://nodejs.org/).
2.  **Git**: The Royal Scribe's tool for tracking and managing code. Download and install it from [git-scm.com](https://git-scm.com/).
3.  **A Code Editor**: A tool like [Visual Studio Code](https://code.visualstudio.com/) is highly recommended.

### Summoning a Local Copy
Follow these steps in a terminal (like Command Prompt, PowerShell, or the terminal inside VS Code).

**1. Clone the Kingdom's Code:**
First, you must retrieve the complete and finalized code from its repository.

```bash
git clone https://github.com/ksnprogrammer/KD.git
```

**2. Enter the Kingdom's Directory:**
Navigate into the newly created folder. All subsequent commands must be run from here.

```bash
cd KD
```

**3. Install All Dependencies:**
This single command will automatically read the `package.json` scroll and install all the necessary magical components (dependencies) for the kingdom to function.

```bash
npm install
```

**4. Run the Kingdom:**
This command starts your local development server. Your PC is now the official server for KingDragons!

```bash
npm run dev -- -p 9002
```

Once you see a "ready" message in your terminal, your kingdom is running. You can access it on your own machine in your web browser at: **[http://localhost:9002](http://localhost:9002)**

---

## Part 2: Opening the Gates to the World

To allow knights from across the globe to access the kingdom running on your PC, we will use a magical conduit called **Cloudflare Tunnel**.

**1. Install Cloudflare Tunnel:**
This tool must be installed manually. Follow the official Cloudflare guide to install `cloudflared` on your Windows machine: [Install cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/installation/).

**2. Authenticate Cloudflare:**
Open a **new, separate terminal** and run this command. It will open a browser window asking you to log in to Cloudflare and authorize the tunnel.

```bash
cloudflared tunnel login
```

**3. Create and Run the Public Link:**
While your application is still running (from `npm run dev` in the other terminal), run the following command in your new terminal. This creates a secure, public link directly to your local server.

```bash
cloudflared tunnel --url http://localhost:9002
```

Your terminal will display a public URL ending in `.trycloudflare.com`. It will look something like this:

`https://your-random-tunnel-name.trycloudflare.com`

**This is the live, public link to your KD system! You can share it with anyone in the world to access the kingdom running on your PC.**

---

## Part 3: Managing the Realm

*   **To Stop the Kingdom:** Press `Ctrl + C` in the terminal where you ran `npm run dev`.
*   **To Stop the Public Link:** Press `Ctrl + C` in the terminal where you ran `cloudflared tunnel`.
*   **Pushing Your Changes to GitHub:** As you make changes to the code, you must save them to your GitHub repository. I, your AI assistant, make the code changes. You, the King, must commit them.
    ```bash
    git add .
    git commit -m "A new decree from the King"
    git push origin main
    ```
The kingdom is ready. Your reign may now begin.