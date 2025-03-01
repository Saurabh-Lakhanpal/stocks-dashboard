# **Deploying a Project on EC2**

---

## **Part 1: Creating and Configuring the EC2 Instance**

We’ll begin by creating and setting up the Amazon EC2 instance where your project will live.

---

### **Step 1: Sign Up and Log In to AWS**

1. **Sign Up for AWS (If You Don’t Have an Account):**
   - Open your browser and go to [AWS Sign Up](https://aws.amazon.com/).
   - Click **Create an AWS Account**.
   - Enter your email, a strong password, and your account name (anything like "My AWS Account").
   - Choose **Personal** for account type and fill out the necessary fields (name, address, etc.).
   - Provide valid payment information (AWS uses this to verify your account; there’s no charge for free-tier usage).
   - Complete the CAPTCHA and verify your email.

2. **Log In to Your AWS Account:**
   - Go to [AWS Console](https://aws.amazon.com/console/).
   - Enter your email and password.
   - You’ll now see the **AWS Management Console** homepage.

---

### **Step 2: Open the EC2 Dashboard**

1. **Find EC2:**
   - In the search bar at the top of the AWS Console, type **EC2**.
   - Click on **EC2** under the "Services" section.

2. **Access the EC2 Dashboard:**
   - The EC2 Dashboard will now open. This is where you manage all your EC2 instances.

---

### **Step 3: Launch a New EC2 Instance**

1. **Click "Launch Instance":**
   - In the EC2 Dashboard, click the **Launch Instance** button.

2. **Configure the Instance:**
   - **Step 1: Name Your Instance**
     - Enter a name for your instance, such as `Stocks-Dashboard-Instance`.
   - **Step 2: Select Amazon Machine Image (AMI):**
     - Choose **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**. If you can’t find this version, use **Ubuntu 20.04 LTS**.
     - Why? Ubuntu is beginner-friendly, reliable, and widely supported.
   - **Step 3: Choose Instance Type:**
     - Select **t2.micro** (this is free-tier eligible and sufficient for this project).
   - **Step 4: Key Pair (For SSH Access):**
     - If you don’t have a key pair:
       - Click **Create new key pair**.
       - Name your key pair something like `MyKeyPair`.
       - Choose the `.pem` file format (for Linux/Mac/PowerShell users).
       - Click **Create Key Pair** and download the `.pem` file to a secure location (e.g., `Documents/AWS/Keys`).
       - **Important:** This file is your only way to access your instance. If lost, you cannot log in.
     - If you already have a key pair, select it from the dropdown menu.
   - **Step 5: Configure Network Settings:**
     - Click **Edit** under "Firewall (security groups)."
     - Add the following rules:
       - **SSH (Port 22):** Allows you to log in remotely. Set the source to **My IP** (restricts access to your IP).
       - **HTTP (Port 80):** Required to serve web traffic. Set the source to **Anywhere**.
       - **HTTPS (Port 443):** Optional but recommended for secure connections. Set the source to **Anywhere**.
   - **Step 6: Configure Storage:**
     - Leave the default storage size at 8 GiB unless your project requires more.

3. **Launch the Instance:**
   - Click **Launch Instance** at the bottom of the page.
   - Wait for the instance to initialize. You’ll see its status marked as **running** on the EC2 Dashboard.

---

### **Step 4: Connect to Your EC2 Instance**

1. **Locate the Public IP Address:**
   - In the EC2 Dashboard, click on your instance’s name (e.g., `Stocks-Dashboard-Instance`).
   - Under the "Details" section, locate the **Public IPv4 Address** (e.g., `54.XX.XX.XX`). Copy this address for later.

2. **Prepare Your Local Machine:**
   - Ensure you have a terminal installed:
     - **Mac/Linux Users:** Use the default terminal.
     - **Windows Users:** Use PowerShell or install an SSH client like PuTTY.

3. **Navigate to Your `.pem` File:**
   - Open your terminal and move to the folder where your key pair `.pem` file is stored:
     ```bash
     cd /path/to/your/.pem/file
     ```
     Replace `/path/to/your/.pem/file` with the actual path to the folder where your key file is saved.

4. **Set File Permissions:**
   - Restrict access to the key file to ensure security:
     ```bash
     chmod 400 <YOUR_KEY_PAIR>.pem
     ```
     Replace `<YOUR_KEY_PAIR>` with the name of your `.pem` file (e.g., `MyKeyPair.pem`).

5. **Log in via SSH:**
   - Connect to your EC2 instance using the Public IPv4 Address and key pair:
     ```bash
     ssh -i <YOUR_KEY_PAIR>.pem ubuntu@<YOUR_EC2_IP>
     ```
     Replace:
     - `<YOUR_KEY_PAIR>`: Your `.pem` file (e.g., `MyKeyPair.pem`).
     - `<YOUR_EC2_IP>`: The public IPv4 address of your instance.

6. **Verify the Connection:**
   - If it’s your first time connecting, you’ll see:
     ```
     The authenticity of host '54.XX.XX.XX' can't be established.
     Are you sure you want to continue connecting (yes/no)?
     ```
   - Type `yes` and press Enter.
   - Once connected, your terminal will show something like:
     ```
     ubuntu@ip-54-XX-XX-XX:~$
     ```

---

### **Step 5: Update Your EC2 Instance**

1. **Why Update?**
   - EC2 instances may start with outdated packages. Updating ensures you have the latest security patches and software.

2. **Run the Update Commands:**
   - Enter the following command to update your EC2 instance:
     ```bash
     sudo apt update && sudo apt upgrade -y
     ```
     Explanation:
     - `sudo apt update`: Updates the list of available packages.
     - `sudo apt upgrade -y`: Installs updates. The `-y` option auto-confirms prompts.

3. **Verify Updates:**
   - Check if any updates are still pending:
     ```bash
     sudo apt list --upgradable
     ```
     If nothing is listed, your instance is fully updated.

4. **Reboot the Instance (Optional):**
   - If kernel updates were applied, reboot the server:
     ```bash
     sudo reboot
     ```
   - After rebooting, reconnect using the SSH command:
     ```bash
     ssh -i <YOUR_KEY_PAIR>.pem ubuntu@<YOUR_EC2_IP>
     ```

---

## **Part 2: Installing and Configuring Required Tools**

### **Step 6: Install Python and Set Up the Project Directory**

---

#### **Install Python**
1. **Why Install Python?**
   - Python is the programming language required to run your project. On the EC2 instance, you’ll need Python, `pip` (Python’s package manager), and tools to create isolated virtual environments.

2. **Run Installation Commands:**
   - To install Python 3, pip, and the virtual environment tools, run:
     ```bash
     sudo apt install python3 python3-pip python3-venv -y
     ```
   - Breakdown of commands:
     - `python3`: Installs the Python interpreter.
     - `pip3`: Installs Python’s package manager.
     - `python3-venv`: Enables the creation of isolated Python environments.

3. **Verify Python Installation:**
   - To ensure Python is installed correctly, check its version:
     ```bash
     python3 --version
     ```
   - The output should show a version like `Python 3.10.x`.

---

#### **Set Up the Project Directory**
1. **Why Do This?**
   - It’s best practice to keep your project files organized in a dedicated folder, making it easier to manage and deploy your application.

2. **Create a New Directory:**
   - Use the following commands to create and navigate into your project directory:
     ```bash
     mkdir stocks-dashboard
     cd stocks-dashboard
     ```
   - Explanation:
     - `mkdir stocks-dashboard`: Creates a folder named `stocks-dashboard`.
     - `cd stocks-dashboard`: Moves you into this folder.

3. **Confirm Directory Location:**
   - Check your current working directory by running:
     ```bash
     pwd
     ```
   - The output should display something like:
     ```
     /home/ubuntu/stocks-dashboard
     ```

---

#### **Set Up a Virtual Environment**
1. **Why Do This?**
   - A virtual environment isolates your project’s dependencies, ensuring they don’t interfere with other projects or the system’s global Python installation.

2. **Create the Virtual Environment:**
   - Inside the `stocks-dashboard` directory, run:
     ```bash
     python3 -m venv venv
     ```
   - This creates a folder named `venv` that will store all libraries and dependencies required for your project.

3. **Activate the Virtual Environment:**
   - Run the following command to activate the virtual environment:
     ```bash
     source venv/bin/activate
     ```
   - You’ll know the virtual environment is active when `(venv)` appears at the beginning of your terminal prompt:
     ```
     (venv) ubuntu@ip-XX-XX-XX-XX:~/stocks-dashboard$
     ```

4. **Verify the Virtual Environment:**
   - Check the Python path to confirm you’re using the virtual environment’s Python:
     ```bash
     which python
     ```
   - The output should point to the virtual environment’s Python binary, like:
     ```
     /home/ubuntu/stocks-dashboard/venv/bin/python
     ```

---

### **Step 7: Install Project Dependencies**

---

#### **Install Required Libraries**
1. **Why Install Libraries?**
   - Libraries like Flask and SQLAlchemy are essential for running your project. These are typically listed in a `requirements.txt` file.

2. **Install from `requirements.txt`:**
   - If you have a `requirements.txt` file in your project directory, run:
     ```bash
     pip install -r requirements.txt
     ```
   - This command will install all the libraries listed in the file, such as Flask, pandas, and SQLAlchemy.

3. **Manual Installation (If No `requirements.txt` Exists):**
   - If you don’t have a `requirements.txt` file, manually install required libraries. For example:
     ```bash
     pip install flask flask-cors sqlalchemy psycopg2-binary pandas kaggle yfinance pandas-datareader requests beautifulsoup4 matplotlib pillow
     ```
   - These libraries may include:
     - `Flask`: For building web applications.
     - `SQLAlchemy` and `psycopg2-binary`: For interacting with a PostgreSQL database.
     - `pandas`: For data manipulation.
     - `kaggle`, `yfinance`, and `pandas-datareader`: For accessing datasets and financial data.
     - `beautifulsoup4` and `requests`: For web scraping and API requests.
     - `matplotlib` and `pillow`: For visualizations and image processing.

---

#### **Verify Installed Libraries**
1. **List Installed Libraries:**
   - Run:
     ```bash
     pip freeze
     ```
   - This will display all installed libraries and their versions. Example:
     ```
     Flask==2.x.x
     SQLAlchemy==1.x.x
     pandas==1.x.x
     ```

2. **Save Installed Libraries:**
   - If you installed libraries manually, save them to a `requirements.txt` file for future use:
     ```bash
     pip freeze > requirements.txt
     ```
   - This creates a `requirements.txt` file in your project directory.

---

### **Step 8: Install PostgreSQL and Configure the Database**

---

#### **Install PostgreSQL**
1. **Why Install PostgreSQL?**
   - PostgreSQL is a powerful, open-source relational database management system used for storing and managing project data.

2. **Run the Installation Command:**
   - Install PostgreSQL and its additional components:
     ```bash
     sudo apt install postgresql postgresql-contrib -y
     ```

3. **Verify Installation:**
   - Check PostgreSQL’s status to ensure it’s running:
     ```bash
     sudo service postgresql status
     ```
   - If it’s not running, start the service:
     ```bash
     sudo service postgresql start
     ```

---

#### **Set Up the Database**
1. **Switch to the PostgreSQL Superuser:**
   - Log in to the PostgreSQL superuser account:
     ```bash
     sudo -i -u postgres
     ```

2. **Access the PostgreSQL CLI:**
   - Launch the PostgreSQL command-line interface:
     ```bash
     psql
     ```
   - The prompt will change to:
     ```
     postgres=#
     ```

3. **Create a Database and User:**
   - Run the following commands in the PostgreSQL CLI:
     ```sql
     CREATE DATABASE stocks_dashboard_db;
     CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';
     GRANT ALL PRIVILEGES ON DATABASE stocks_dashboard_db TO postgres;
     ```
   - Explanation:
     - Creates a new database called `stocks_dashboard_db`.
     - Creates a user named `postgres` with the password `postgres`.
     - Grants the user full access to the database.

4. **Exit the PostgreSQL CLI:**
   - Type:
     ```bash
     \q
     ```

5. **Exit the PostgreSQL Superuser Account:**
   - Return to the Ubuntu user by typing:
     ```bash
     exit
     ```

---

### **Step 9: Verify and Test Your Configuration**

---

#### **Verify the Virtual Environment and Database Setup**
1. **Ensure Virtual Environment is Active:**
   - Check if `(venv)` appears at the start of your terminal prompt.

2. **Test Database Connectivity:**
   - If you have a script to test the database connection, run it. For example:
     ```bash
     python test_db_connection.py
     ```
   - Ensure there are no connection errors.

---

## **Part 3: Uploading, Deploying, and Running the Application**

---

### **Step 10: Upload Your Project Files**

---

#### **Prepare the Project on Your Local Machine**
1. **Check Your Project Folder:**
   - Ensure that your project folder includes:
     - Python scripts (e.g., `app.py`, helper files, etc.).
     - A `requirements.txt` file containing all required Python libraries.
     - Static files like HTML, CSS, and JavaScript (if applicable).
     - Configuration files (e.g., `.env`, `config.py`).

2. **Test the Project Locally:**
   - Before deployment, test your project on your local machine to confirm that it works as expected.

3. **Compress the Project Folder:**
   - Navigate to the folder containing your project:
     ```bash
     cd /path/to/your/project
     ```
   - Create a `.zip` file of your project folder:
     ```bash
     zip -r stocks-dashboard.zip stocks-dashboard/
     ```
   - This will create a compressed file named `stocks-dashboard.zip`.

---

#### **Transfer the Project to Your EC2 Instance**
1. **Use SCP to Transfer the `.zip` File:**
   - From your local computer, run the following command to upload the `.zip` file to your EC2 instance:
     ```bash
     scp -i <YOUR_KEY_PAIR>.pem stocks-dashboard.zip ubuntu@<YOUR_EC2_IP>:~/
     ```
     Replace:
     - `<YOUR_KEY_PAIR>`: The name of your `.pem` file.
     - `<YOUR_EC2_IP>`: The public IPv4 address of your EC2 instance.

2. **Verify the File Transfer:**
   - Log in to your EC2 instance:
     ```bash
     ssh -i <YOUR_KEY_PAIR>.pem ubuntu@<YOUR_EC2_IP>
     ```
   - List the files in your home directory:
     ```bash
     ls
     ```
   - You should see the file `stocks-dashboard.zip` listed.

---

#### **Extract and Organize Project Files**
1. **Unzip the Project File:**
   - Run the following command to extract the `.zip` file:
     ```bash
     unzip stocks-dashboard.zip
     ```
   - Verify the contents by listing the extracted files:
     ```bash
     ls stocks-dashboard
     ```
     You should see your project files, including `app.py` and `requirements.txt`.

2. **Navigate to the Project Directory:**
   - Move into the extracted project folder:
     ```bash
     cd stocks-dashboard
     ```

---

### **Step 11: Configure and Test the Application Locally on EC2**

---

#### **Activate the Virtual Environment**
1. **Ensure the Virtual Environment is Set Up:**
   - If the virtual environment hasn’t been created yet, create one:
     ```bash
     python3 -m venv venv
     ```

2. **Activate the Virtual Environment:**
   - Run:
     ```bash
     source venv/bin/activate
     ```

3. **Verify Activation:**
   - Confirm you’re using the virtual environment’s Python by checking its path:
     ```bash
     which python
     ```
   - The output should point to `stocks-dashboard/venv/bin/python`.

---

#### **Install Project Dependencies**
1. **Install Required Libraries:**
   - Install all dependencies listed in `requirements.txt`:
     ```bash
     pip install -r requirements.txt
     ```

2. **Verify Dependencies:**
   - List installed libraries to confirm they match your requirements:
     ```bash
     pip freeze
     ```

---

#### **Test the Flask App Locally on the EC2 Server**
1. **Run the Flask App:**
   - Start the Flask application to ensure it runs properly:
     ```bash
     flask run --host=0.0.0.0 --port=5000
     ```

2. **Access the App:**
   - Open your browser on your local machine and navigate to:
     ```
     http://<YOUR_EC2_IP>:5000
     ```
   - Verify that the app loads correctly.

3. **Stop the Flask Development Server:**
   - Press `CTRL + C` in the terminal to stop the server.

---

### **Step 12: Deploy the App with Gunicorn and Nginx**

---

#### **Install and Run Gunicorn**
1. **Why Use Gunicorn?**
   - Gunicorn is a production-ready server that efficiently handles multiple web requests, unlike the Flask development server.

2. **Install Gunicorn (If Not Already Installed):**
   - Ensure the virtual environment is active:
     ```bash
     source venv/bin/activate
     ```
   - Install Gunicorn:
     ```bash
     pip install gunicorn
     ```

3. **Run the Flask App with Gunicorn:**
   - Start the Flask app using Gunicorn:
     ```bash
     gunicorn -w 4 -b 0.0.0.0:8000 app:app
     ```
     Replace `app:app` with the entry point of your Flask app. For example:
     - If your main file is `app.py` and the app is named `app`, use `app:app`.

4. **Test Gunicorn:**
   - Open your browser and go to:
     ```
     http://<YOUR_EC2_IP>:8000
     ```
   - Verify that the app is running.

5. **Stop Gunicorn:**
   - Press `CTRL + C` in the terminal to stop the server.

---

#### **Configure Nginx**
1. **Install Nginx:**
   - Run the following command:
     ```bash
     sudo apt install nginx -y
     ```

2. **Create an Nginx Configuration File:**
   - Open a new configuration file for your project:
     ```bash
     sudo nano /etc/nginx/sites-available/stocks_dashboard
     ```
   - Add the following configuration:
     ```
     server {
         listen 80;
         server_name <YOUR_EC2_IP>;

         location / {
             proxy_pass http://127.0.0.1:8000;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```
     Replace `<YOUR_EC2_IP>` with your EC2 instance’s public IPv4 address.

3. **Save and Exit:**
   - Save the file by pressing `CTRL + O`, then press **Enter**.
   - Exit the editor by pressing `CTRL + X`.

4. **Enable the Nginx Configuration:**
   - Link the configuration file to the enabled sites directory:
     ```bash
     sudo ln -s /etc/nginx/sites-available/stocks_dashboard /etc/nginx/sites-enabled
     ```

5. **Restart Nginx:**
   - Test the configuration for syntax errors:
     ```bash
     sudo nginx -t
     ```
   - If the configuration is valid, restart Nginx:
     ```bash
     sudo service nginx restart
     ```

---

### **Step 13: Verify Deployment**

---

1. **Access Your App in a Browser:**
   - Open your browser and go to:
     ```
     http://<YOUR_EC2_IP>
     ```
   - Your app should now be live on port 80 and publicly accessible.

2. **Check Logs for Errors:**
   - If the app doesn’t load, check the Nginx and Gunicorn logs for errors:
     - Gunicorn logs:
       ```bash
       sudo journalctl -u gunicorn
       ```
     - Nginx logs:
       ```bash
       sudo journalctl -u nginx
       ```

---

## **Part 4: Automating and Monitoring Your Deployment**

---

### **Step 14: Automate Gunicorn with systemd**

---

#### **Why Automate Gunicorn?**
- When you start Gunicorn manually, it stops as soon as the terminal is closed or the server restarts. By setting up Gunicorn as a `systemd` service, it will:
  - Run in the background.
  - Restart automatically if the server is rebooted.
  - Be easier to manage with simple start, stop, and restart commands.

---

#### **Create a Gunicorn Service File**

1. **Open a New Service File:**
   - Run this command to create a service file for Gunicorn:
     ```bash
     sudo nano /etc/systemd/system/gunicorn.service
     ```

2. **Add the Following Configuration:**
   - Paste the following content into the file:
     ```
     [Unit]
     Description=Gunicorn instance to serve Flask app
     After=network.target

     [Service]
     User=ubuntu
     Group=www-data
     WorkingDirectory=/home/ubuntu/stocks-dashboard
     Environment="PATH=/home/ubuntu/stocks-dashboard/venv/bin"
     ExecStart=/home/ubuntu/stocks-dashboard/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 app:app

     [Install]
     WantedBy=multi-user.target
     ```
     Replace:
     - `/home/ubuntu/stocks-dashboard` with the actual path to your project directory.
     - `app:app` with the entry point of your Flask application (e.g., if `app.py` contains your app, use `app:app`).

3. **Save and Exit:**
   - Press `CTRL + O`, then press **Enter** to save.
   - Press `CTRL + X` to exit the editor.

---

#### **Enable and Start Gunicorn**

1. **Reload the systemd Configuration:**
   - Let `systemd` recognize the new Gunicorn service:
     ```bash
     sudo systemctl daemon-reload
     ```

2. **Start the Gunicorn Service:**
   - Start Gunicorn using systemd:
     ```bash
     sudo systemctl start gunicorn
     ```

3. **Enable Gunicorn to Start on Boot:**
   - Make the service start automatically if the server is restarted:
     ```bash
     sudo systemctl enable gunicorn
     ```

4. **Check the Service Status:**
   - Verify that the Gunicorn service is running:
     ```bash
     sudo systemctl status gunicorn
     ```
   - You should see something like:
     ```
     Active: active (running)
     ```

---

### **Step 15: Monitor Logs and Performance**

---

#### **Monitor Application Logs**
1. **Check Gunicorn Logs:**
   - View Gunicorn service logs for any errors or activity:
     ```bash
     sudo journalctl -u gunicorn
     ```

2. **Check Nginx Logs:**
   - View Nginx access logs (incoming requests):
     ```bash
     sudo tail -f /var/log/nginx/access.log
     ```
   - View Nginx error logs (issues with serving requests):
     ```bash
     sudo tail -f /var/log/nginx/error.log
     ```

---

#### **Monitor Application Performance**
1. **Install htop (Optional):**
   - htop is a helpful tool to monitor server performance (CPU, memory, etc.):
     ```bash
     sudo apt install htop -y
     ```

2. **Run htop:**
   - Launch it by typing:
     ```bash
     htop
     ```
   - Use this to monitor resource usage in real time.

---

### **Step 16: Perform Final Tests**

---

#### **Test All Functionality**
1. **Access Your Application:**
   - Open a browser and go to:
     ```
     http://<YOUR_EC2_IP>
     ```
   - Test all pages, APIs, and interactive features to ensure everything is functioning as expected.

2. **Simulate a Server Reboot:**
   - Restart the server:
     ```bash
     sudo reboot
     ```
   - After the server restarts, verify that:
     - The Gunicorn service is running automatically:
       ```bash
       sudo systemctl status gunicorn
       ```
     - Your app is live and accessible via the browser.

---

#### **Clean Up Temporary Files**
1. **Remove Unnecessary Files:**
   - If the `.zip` file used for uploading your project is no longer needed, delete it:
     ```bash
     rm ~/stocks-dashboard.zip
     ```

2. **Keep Logs Under Control:**
   - If logs grow too large, clear them periodically. For example:
     ```bash
     sudo truncate -s 0 /var/log/nginx/access.log
     sudo truncate -s 0 /var/log/nginx/error.log
     ```

---

### **Step 17: Add Security Enhancements (Optional)**

---

#### **Restrict SSH Access**
1. **Use Key-Based Authentication Only:**
   - Disable password authentication for SSH by editing the SSH config file:
     ```bash
     sudo nano /etc/ssh/sshd_config
     ```
   - Set the following:
     ```
     PasswordAuthentication no
     ```
   - Restart the SSH service:
     ```bash
     sudo service ssh restart
     ```

2. **Restrict Allowed IPs:**
   - Edit your security group in the AWS Management Console to allow SSH only from your specific IP address.

---

#### **Enable a Firewall (Optional)**
1. **Install UFW (Uncomplicated Firewall):**
   - Run:
     ```bash
     sudo apt install ufw -y
     ```

2. **Allow Necessary Ports:**
   - Allow only SSH, HTTP, and HTTPS traffic:
     ```bash
     sudo ufw allow 22
     sudo ufw allow 80
     sudo ufw allow 443
     ```

3. **Enable the Firewall:**
   - Start the firewall:
     ```bash
     sudo ufw enable
     ```
   - Check the status:
     ```bash
     sudo ufw status
     ```

---

### **Finally**
- Congratulations! Your application is now deployed, automated, and secured on an Amazon EC2 instance.
- If you follow these steps carefully, your project should run smoothly and reliably, even with a server reboot.