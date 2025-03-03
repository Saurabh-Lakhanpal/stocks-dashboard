## 📖 Table of Contents

- [Deploying this Project on Local Machine](#Deploying this Project on Local Machine)
- [Deploying this Project on EC2](#Deploying this Project on EC2)

---

## **Deploying the Project on a Local Machine**

#### **1. Obtain API Keys**
   - **YH Finance API Key:**
     - Visit [YH Finance](https://financeapi.net/).
     - Sign up or log in to your account and generate an API key. This key is necessary for accessing financial data.
   - **Kaggle API Key:**
     - Visit [Kaggle](https://www.kaggle.com/).
     - Log in and navigate to your account settings to generate an API key.

---

#### **2. Clone the Repository**
   - Open a terminal or Git Bash on your local machine.
   - Clone the project repository using the following command:
     ```bash
     git clone <repository_link>
     ```
   - Replace `<repository_link>` with the actual URL of the project repository.

---

#### **3. Review Directory Structure**
   - Refer to the **README.md** file in the cloned repository to understand the directory structure.
   - Ensure all files and folders are in their correct locations as specified.

---

#### **4. Create `.Kaggle` Folder**
   - On your local machine:
     - Create a folder named `.Kaggle`.
     - Place the **Kaggle API key** file (usually named `kaggle.json`) in this folder.
   - Follow the advised directory path mentioned in the project documentation (e.g., `~/.Kaggle` on Unix systems or the equivalent on Windows).

---

#### **5. Create `config.js`**
   - Create a file named `config.js`.
   - Add any required configuration details, such as API keys or project settings, to this file.
   - Place the file in the advised directory path mentioned in the project documentation.

---

#### **6. Run the Jupyter Notebook**
   - Open the **`Stocks_dashboard_ETL.ipynb`** file in Jupyter Notebook or Jupyter Lab.
   - Run all the cells in the notebook sequentially to process and extract the required data.
     - Note: Ensure you have installed Jupyter and any required Python packages beforehand.

---

#### **7. Run the Application Locally**
   - Open a terminal on your local machine.
   - Navigate to the project directory where the backend script is located.
   - Run the local backend application using the following command:
     ```bash
     python3 appLocal.py
     ```

---

#### **8. View the HTML Files**
   - Locate the `index_p1.html` and `index_p2.html` files in the project directory.
   - Open these files in your default browser to view the user interface of the application.

---

## **Deploying this Project on EC2**

#### **1. Create an AWS Account and Log In**
   - Visit [AWS](https://aws.amazon.com/) and create an account by following the registration process.
   - Once your account is verified, log in using your credentials to access the AWS Management Console.

---

#### **2. Create an EC2 Server with AMI as Linux 2023**
   - In the AWS Management Console, navigate to the **EC2 Dashboard**.
   - Click on **Launch Instance** and select **Amazon Machine Image (AMI)**. Choose "Linux 2023" as the AMI type.
   - Configure the instance settings:
     - Specify the instance type (e.g., t2.micro for free-tier eligible).
     - Generate a new `.ppk` key file when prompted. Download and save this file securely as it is crucial for authentication.
   - While setting up the instance, ensure you add an inbound rule to allow **HTTPS traffic**.
   - After completing the setup, click **Launch Instance**.
   - Wait for the instance to be authenticated. Once it is running, copy the **IPv4 public address** of the instance—this will be used to connect later.

---

#### **3. Install PuTTY and WinSCP**
   - On your Windows machine:
     - Download and install [PuTTY](https://www.putty.org/), which is used to SSH into the server.
     - Download and install [WinSCP](https://winscp.net/eng/index.php), which is used to transfer files between your local machine and the server.

---

#### **4. Use PuTTY to Tunnel into the Server**
   - Open PuTTY:
     - In the **Host Name (or IP address)** field, enter the IPv4 address of your EC2 instance.
     - Expand the **SSH** section in the left menu and navigate to **Auth** (Authentication).
     - Browse and load the `.ppk` key file you saved earlier.
   - Click **Open** to establish the connection. You will now have access to your server via SSH.

---

#### **5. Install Necessary Packages and Create Your Environment**
   - In the PuTTY terminal, run the following commands to update the system and install required packages:

```bash
sudo yum update -y
sudo yum install python3-pip
pip3 install Kaggle
pip3 install pandas
pip3 install sqlalchemy
pip3 install psycopg2-binary
pip3 install yfinance
pip3 install pandas_datareader
pip3 install requests
pip3 install beautifulsoup4
pip3 install flask
pip3 install flask_cors
pip3 install python-dateutil==2.8.2
pip3 install notebook
pip3 install nbconvert
```

---

#### **6. Install PostgreSQL**
   - Use the following command to install PostgreSQL 15 and its server components:
     ```bash
     sudo yum install postgresql15 postgresql15-server -y
     ```

---

#### **7. Set Up and Initialize PostgreSQL**
   - Enable and initialize PostgreSQL:
     ```bash
     sudo systemctl enable postgresql.service
     sudo /usr/bin/postgresql-setup --initdb
     sudo systemctl start postgresql.service
     sudo systemctl status postgresql.service
     ```

   - If necessary, reinitialize the database:
     ```bash
     sudo rm -rf /var/lib/pgsql/data/*
     sudo /usr/bin/postgresql-setup --initdb
     ```

---

#### **8. Change PostgreSQL Password**
   - Switch to the `postgres` user and modify the password:
     ```bash
     sudo su - postgres
     psql
     \l
     \du
     ALTER USER postgres WITH PASSWORD 'postgres';
     ALTER USER postgres WITH SUPERUSER;
     \q
     exit
     ```

---

#### **9. Configure PostgreSQL Settings**
   - Edit the `pg_hba.conf` file to set authentication methods:
     ```bash
     sudo nano /var/lib/pgsql/data/pg_hba.conf
     ```
     Add the following lines:
     ```
     local   all             postgres                                md5
     host    all             postgres        127.0.0.1/32            md5
     host    all             postgres        ::1/128                 md5
     ```

   - Modify the `postgresql.conf` file to allow external connections:
     ```bash
     sudo nano /var/lib/pgsql/data/postgresql.conf
     ```
     Update:
     ```
     listen_addresses = '*'
     ```

   - Save changes with:
     - `CTRL + O`, press **Enter**, then `CTRL + X`.

   - Restart PostgreSQL:
     ```bash
     sudo systemctl restart postgresql.service
     ```

---

#### **10. Transfer Files Using WinSCP**
   - Open WinSCP and configure the connection:
     - Select **SFTP** protocol.
     - Enter the IPv4 public address of the EC2 instance.
     - Under **Advanced Settings**, go to SSH -> Authentication and load your `.ppk` key.
     - Use `ec2-user` as the username.
   - Drag and drop files from your local machine to the server.

---

#### **11. Run the ETL Process**
   - In PuTTY, navigate to the `Backend` folder and execute the ETL script:
     ```bash
     cd stocks-dashboard
     cd Backend
     python3 etl.py
     ```

---

#### **12. Verify the Database**
   - Check the database and its tables:
     ```bash
     sudo su - postgres
     psql
     \c stocks_dashboard_db
     \dt
     \d portfolio_tb
     SELECT COUNT(*) FROM portfolio_tb;
     exit
     cd ~
     ```

---

#### **13. Run the Flask Application**
   - Start the backend application:
     ```bash
     cd stocks-dashboard
     cd Backend
     python3 app.py
     ```

---

#### **14. Configure EC2 Security Groups**
   - In the EC2 dashboard, navigate to **Security Groups**.
   - Create a new security group to allow all traffic. Add an **Inbound Rule** for IPv4.
   - Assign the security group to your instance by updating the instance’s security settings.

---

#### **15. Access the API**
   - Use the public IPv4 DNS of your instance and append `:8080` to access the API in a browser or tool like Postman.

---

#### **16. Verify Server Access**
   - Test the server to ensure it is accessible and functional.

---
