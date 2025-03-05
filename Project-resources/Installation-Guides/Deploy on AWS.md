## **Deploying this Project on EC2**

### **1. Create an AWS Account and Log In**
   - Visit [AWS](https://aws.amazon.com/) and create an account by following the registration process.
   - Once your account is verified, log in using your credentials to access the AWS Management Console.

---

### **2. Choose to Create an EC2 Server with AMI as Linux 2023**
   - In the AWS Management Console, navigate to the **EC2 Dashboard**.
   - Click **Launch Instance** and configure the instance:
     - Choose **Linux 2023** as the Amazon Machine Image (AMI).
     - In the **Key pair (login)** section, generate a new `.ppk` key. Save this securely as it will be needed for authentication.
     - In the **Network Settings**, allow both **HTTP traffic** and **HTTPS traffic** from the internet.
   - Launch the instance and wait for authentication.
   - Once the instance is created, note down the **IPv4 public address**, as it will be used to connect to the server.

---

### **3. Check Security for Incoming for the EC2 DNS**
   - Navigate to **Security Groups** from the left-side menu on the EC2 Dashboard.
   - Create a security group to allow all traffic:
     - **Inbound Rules:**
       - IPv4 - All traffic - `0.0.0.0/0`
       - IPv4 - All traffic - `0.0.0.0/8`
       - IPv4 - HTTPS - `0.0.0.0/0`
       - IPv4 - HTTP - `0.0.0.0/0`
       - IPv6 - HTTP - `::/0`
     - **Outbound Rules:**
       - IPv4 - All traffic - `0.0.0.0/0`
   - Assign the security group to your instance:
     - Click **Actions > Security > Change Security Groups** and add the new rule while removing existing ones.
   - Confirm the updated settings in the **Security Tab**.

---

### **4. Install PuTTY and WinSCP**
   - **PuTTY**: Download and install [PuTTY](https://www.putty.org/) for securely tunneling into your server.
   - **WinSCP**: Download and install [WinSCP](https://winscp.net/eng/index.php) for transferring files between your local machine and the server.

---

### **5. Use PuTTY to Tunnel into the Server**
   - Open PuTTY:
     - Enter the **IPv4 public IP** of your EC2 instance in the **Host Name** field.
     - Expand the left-side menu to **SSH > Auth**, then browse and load your `.ppk` key for authentication.
   - Click **Open** to establish the connection.

---

### **6. Install the Packages and Create Your Environment**
   - Run the following commands in PuTTY to update your system and install necessary packages:

```bash
sudo yum update -y
sudo yum install python3-pip
sudo yum install nginx -y
sudo yum install postgresql15 postgresql15-server -y
pip install gunicorn
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

### **7. PostgreSQL Setup and Initialization**
   - Set up and initialize PostgreSQL by running the following commands:
     ```bash
     sudo systemctl enable postgresql.service
     cd /usr/bin
     ls -ltrh post*
     sudo rm -rf /var/lib/pgsql/data/*
     sudo /usr/bin/postgresql-setup --initdb
     sudo systemctl start postgresql.service
     sudo systemctl status postgresql.service
     cd ~
     ```

---

### **8. Change Passwords for PostgreSQL User**
   - Update the PostgreSQL password for the `postgres` user:
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

### **9. Configure PostgreSQL Settings**
   - Edit the `pg_hba.conf` file to update authentication settings:
     ```bash
     sudo nano /var/lib/pgsql/data/pg_hba.conf
     ```
     - Add the following lines to allow password-based connections:
       ```
       local   all             postgres                                md5
       host    all             postgres        127.0.0.1/32            md5
       host    all             postgres        ::1/128                 md5
       ```
     - Modify these lines for all connections:
       ```
       local   all             all                                     md5
       host    all             all             127.0.0.1/32            md5
       host    all             all             ::1/128                 md5
       host    replication     all             127.0.0.1/32            md5
       host    replication     all             ::1/128                 md5
       ```
     - Save changes with `CTRL + O`, press **Enter**, and exit with `CTRL + X`.

   - Edit the `postgresql.conf` file to enable external connections:
     ```bash
     sudo nano /var/lib/pgsql/data/postgresql.conf
     ```
     - Change the value of `listen_addresses`:
       ```
       listen_addresses = '*'
       ```
     - Save changes with `CTRL + O`, press **Enter**, and exit with `CTRL + X`.

   - Restart PostgreSQL:
     ```bash
     sudo systemctl restart postgresql.service
     ```

---

### **10. Transfer Files Using WinSCP**
   - Open **WinSCP** and configure the connection:
     - Choose the **SFTP** protocol.
     - Enter the **IPv4 public IP** of the EC2 instance.
     - Go to **Advanced Settings** > **SSH > Authentication** and upload your `.ppk` key.
     - Set the username as `ec2-user`.
   - Transfer project files and arrange the directory structure as follows:

```
/home/ec2-user/
    ├── Stocks-dashboard
    │   └── Backend
    │       ├── .kaggle
    │       │   └── kaggle.json
    │       ├── Resources
    │       │   └── "csv files get downloaded, consumed, and purged here"
    │       ├── stocks_dashboard_ETL.ipynb
    │       ├── app.py
    │       ├── appLocal.py
    │       ├── etl.py
    │       └── stocks_dashboard_db_schema.sql
    └── website
        └── Frontend
            ├── assets
            │   ├── Amazon.svg
            │   ├── Logo.svg
            │   ├── apple.svg
            │   ├── mcdonalds.svg
            │   ├── netflix.svg
            │   ├── nvidia.svg
            │   ├── refresh.svg
            │   └── tesla.svg
            ├── css
            │   └── styles.css
            ├── js
            │   ├── url.js
            │   ├── config.js
            │   └── p1_scripts
            ├── index_p1.html
            └── index_p2.html
/tem/
└── stocks.csv
```

---

### **11. Run ETL Script**
   - Navigate to the `Backend` directory and execute the ETL script:
     ```bash
     cd stocks-dashboard/Backend
     python3 etl.py
     ```

---

### **12. Manually Load S&P 500 Data**
   - If the ETL script fails, load data manually into PostgreSQL:
     ```bash
     sudo su - postgres
     psql
     \c stocks_dashboard_db
     \copy sp500_tb (date, open_price, high_price, low_price, close_price, volume, ticker) FROM '/home/ec2-user/stocks-dashboard/stocks.csv' DELIMITER ',' CSV HEADER;
     SELECT COUNT(*) FROM sp500_tb;

     INSERT INTO portfolio_tb (ticker, shares) VALUES ('AAPL', 50);
     INSERT INTO portfolio_tb (ticker, shares) VALUES ('NVDA', 30);
     INSERT INTO portfolio_tb (ticker, shares) VALUES ('AMZN', 40);
     INSERT INTO portfolio_tb (ticker, shares) VALUES ('TSLA', 25);
     INSERT INTO portfolio_tb (ticker, shares) VALUES ('NFLX', 35);
     INSERT INTO portfolio_tb (ticker, shares) VALUES ('MCD', 45);

     \q
     exit
     cd ~
     ```

---

### **13. Run app.py**
   - Navigate to the backend directory and start the Flask application:
     ```bash
     cd stocks-dashboard/Backend
     python3 app.py
     ```

---

### **14. Access the Application**
   - Use the public IPv4 DNS of your instance and append `:8080` to check if the API is accessible:
     ```text
     http://<public-ipv4-dns>:8080
     ```

---

### **15. Set Up NGINX**
   - Start and enable the NGINX server:
     ```bash
     sudo systemctl start nginx
     sudo systemctl enable nginx
     ```
   - Test the NGINX configuration:
     ```bash
     sudo nginx -t
     ```
   - Restart NGINX:
     ```bash
     sudo systemctl restart nginx
     ```

---

### **16. Edit NGINX Configuration**
   - Open the NGINX configuration file:
     ```bash
     sudo nano /etc/nginx/nginx.conf
     ```
   - Ensure the configuration matches this template:

```
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

# Load dynamic modules
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Redirect all HTTP traffic to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl;
        server_name _;
        root /usr/share/nginx/html;

        ssl_certificate "/etc/pki/nginx/server.crt";
        ssl_certificate_key "/etc/pki/nginx/private/server.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 10m;

        location / {
            root /var/www/html;
            index index.html;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:8080;
        }
    }
}
```

   - Save and exit with `CTRL + O`, **Enter**, then `CTRL + X`.

---

### **17. Restart NGINX**
   - Test the updated configuration:
     ```bash
     sudo nginx -t
     ```
   - Restart the server:
     ```bash
     sudo systemctl restart nginx
     ```

---

### **18. Generate an SSL Certificate**
   - If you have a domain, install Certbot and generate an SSL certificate:
     ```bash
     sudo yum install certbot python3-certbot-nginx -y
     ```

   - Alternatively, create a manual certificate:
     ```bash
     sudo mkdir -p /etc/pki/nginx/private
     sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
         -keyout /etc/pki/nginx/private/server.key \
         -out /etc/pki/nginx/server.crt
     ```

---

### **19. Finalize NGINX Configuration**
   - Uncomment the section for SSL in the NGINX configuration:
     ```bash
     sudo nano /etc/nginx/nginx.conf
     ```
   - Test and reload the configuration:
     ```bash
     sudo nginx -t
     sudo systemctl reload nginx
     sudo systemctl restart nginx
     ```

---

### **20. Verify the API**
   - Open the browser and navigate to:
     ```
     {public DNS}/api/v1.0/portfolio
     ```
   - **Expected Output:** You should see JSON data displayed in the browser.

---

### **21. Run the Frontend**
   - Transfer the website files to the correct directory:
     ```bash
     sudo cp -r /home/ec2-user/website/* /var/www/html/
     ```

   - Start the Flask backend application:
     ```bash
     cd /home/ec2-user/stocks-dashboard/Backend
     gunicorn --bind 127.0.0.1:8080 app:app
     ```

   - Adjust permissions for the `/var/www/html/` directory:
     ```bash
     sudo chown -R nginx:nginx /var/www/html/
     sudo chmod -R 755 /var/www/html/
     ls -la /var/www/html/
     ```

---

### **22. Configure Gunicorn Service**
   - Create a systemd service file for Gunicorn:
     ```bash
     sudo nano /etc/systemd/system/gunicorn.service
     ```
   - Add the following configuration:
     ```
     [Unit]
     Description=Gunicorn instance to serve Flask app
     After=network.target

     [Service]
     User=ec2-user
     Group=nginx
     WorkingDirectory=/home/ec2-user/stocks-dashboard/Backend
     ExecStart=/usr/bin/gunicorn --bind 127.0.0.1:8080 app:app

     [Install]
     WantedBy=multi-user.target
     ```

   - Enable and start the Gunicorn service:
     ```bash
     sudo systemctl enable gunicorn
     sudo systemctl start gunicorn
     ```

---

### **23. Run Python in the Background**
   - Use the `nohup` command to run `app.py` in the background:
     ```bash
     nohup python3 app.py &
     ```

   - Check for output or errors:
     ```bash
     cat nohup.out
     ```

   - Ensure the script is running:
     ```bash
     ps aux | grep app.py
     ```

---

### **24. Stop Background Python Process**
   - Locate the running process:
     ```bash
     ps aux | grep app.py
     ```
   - Example output:
     ```
     ec2-user  42657  0.1  1.2  123456  56789 ? S  22:46   0:00 python3 app.py
     ```
   - Stop the process:
     ```bash
     kill 42657
     ```
   - Force-stop, if necessary:
     ```bash
     kill -9 42657
     ```

---

