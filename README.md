# SoleerDevs 3-Day Solana Boot Camp - Your Learning Journey Starts Here! 🚀

Welcome to the official GitHub repository for the SoleerDevs 3-Day Solana Boot Camp! This repository contains all the starter code, setup instructions, and helpful resources you'll need to make the most of our hands-on workshop.

**What You'll Learn:**

Over three action-packed days, you'll go from the basics of Solana to building a fully functional decentralized application (dApp):

* **Day 1: Solana Basics & Wallet Connection:** Understand Solana fundamentals and connect your first wallet using our pre-configured React starter code.
* **Day 2: Sending Transactions & Working with Tokens:** Learn about Solana transactions, work with SPL tokens, and build the functionality to send SOL.
* **Day 3: Data & Bringing It All Together:** Explore fetching on-chain data and integrate with a simple Anchor program to post messages to the blockchain.

**Getting Started - Pre-Workshop Setup:**

Before the boot camp begins, please ensure you have the following installed and configured. This will help you hit the ground running on Day 1!

1.  **Node.js:** You'll need Node.js installed to run the React application. You can download it from the official website: [https://nodejs.org/](https://nodejs.org/) (We recommend the LTS version).

    * **Verification:** Open your terminal or command prompt and run:
        ```bash
        node -v
        npm -v
        ```
        You should see version numbers for both Node.js and npm (Node Package Manager).

2.  **Git:** Git is essential for version control and for cloning this repository. If you don't have it installed, you can find instructions here: [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

    * **Verification:** Open your terminal and run:
        ```bash
        git --version
        ```

3.  **VS Code (Recommended):** While you can use any code editor, we recommend Visual Studio Code for this boot camp due to its excellent JavaScript and React support. You can download it here: [https://code.visualstudio.com/](https://code.visualstudio.com/)

4.  **Phantom Wallet Browser Extension:** Phantom is a popular Solana wallet that we'll be using throughout the boot camp. Install it on your preferred browser from: [https://phantom.app/](https://phantom.app/)

    * **Setup:** Follow the on-screen instructions to create or import a Solana wallet. **Make sure to securely store your seed phrase!** We will be primarily using the **Devnet** for this boot camp, so ensure your Phantom wallet is connected to the "Devnet" network.

**Accessing the Starter Code:**

Once you have the prerequisites installed:

1.  **Clone the Repository:** Open your terminal, navigate to a directory where you want to store the project, and run the following command:
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd solana-bootcamp-intro
    ```
    *(Replace `[YOUR_REPOSITORY_URL]` with the actual URL of this repository.)*

2.  **Navigate to the Day 1 Starter Code:**
    ```bash
    cd day-1/starter-code
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the React development server. You should be able to view the application in your browser at `http://localhost:3000`.

**Repository Structure:**

* `pre-workshop/`: Contains the setup guide and any other preparatory materials.
* `day-1/starter-code/`, `day-2/starter-code/`, `day-3/starter-code/`: Each directory contains the starting code for the respective day's workshop.
* `resources/`: Includes the beginner-friendly cheat sheet and a troubleshooting guide for common issues.

**We're excited to learn and build with you!**

If you encounter any issues during the setup, please refer to the `resources/troubleshooting.md` file. For further questions and support, join our Discord community: [YOUR_DISCORD_LINK]

See you at the boot camp! 👋
