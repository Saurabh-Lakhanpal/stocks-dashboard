## stocks-dashboard-workflow
![image](https://github.com/user-attachments/assets/0abd04e2-7742-4e29-b18c-02afdfd59ffb)

1. Install the necessary libraries using pip:
     ```bash
     pip install flask pandas requests plotly sqlalchemy psycopg2-binary
     ```
2. Prepare and understand the datasets:
     - [Kaggle API](https://www.kaggle.com/datasets/camnugent/sandp500) for S&P 500 stock data for Historical analysis.
     - [YH Finance API](https://financeapi.net/tutorial) for live stocks overview analytics.
     - Either of the StockGeist, Eden AI, or Alpaca for MArket sentiments gauge.
3. For Historical analysis:
     - Create the ETL Script (Extract, Transform, Load).
     - Use Kaggle API to fetch the csv data.
     - Clean the data, model the data using pandas.
     - Connect to Postgress to load table schema and data into the tables.
     - Also create a fake portfolio table.
4. Create the Flask Backend:
     - Create a new Python file `app.py` for Flask backend.
     - Connect to Postgress to query the tables.
     - Create flask routes to provide the Json for Historical data analysis to the frontend.
6. Frontend Javascript:
     - Create a `app.js` that uses the YH Finance API to produce ineractive live graphics.
     - This should also show a fake portfolio using the flask routes.
     - This should also populate the Historical data analysis using the Flask routes.
8. HTML and Bootstrap:
     - Create an HTML file with a style sheet to create the webpages.
     - Html to plot the Javascript D3 plots.
9. Deploy on AWS:
     - Set Up an EC2 Instance: [aws.amazon.com](https://aws.amazon.com/).
     - Launch an EC2 Instance:
          - Log in to your AWS Management Console.
          - Navigate to the EC2 Dashboard and Launch Instance.
     - Configure Instance:
          - Choose an Amazon Machine Image (AMI):
               - Select the Amazon Linux 2 AMI (or Ubuntu if you prefer).
               - Select the t2.micro instance type, which is free-tier eligible.
               - You can leave the Instance Details at default settings here.
               - The default storage settings should be sufficient.
               - Optionally, add a tag to identify your instance.
          - Configure Security Group:
               - Create a new security group with the following rules:
                    - Port 22 from your IP address.
                    - Port 80 from anywhere.
          - Review and launch your instance.

     - Key Pair:
   - **Create a new key pair** or use an existing one. Download the key pair file (.pem) and keep it safe, as it will be needed to connect to your instance.

#### **2. Connect to Your EC2 Instance**
1. **SSH into Your Instance**:
   - Open your terminal (or command prompt on Windows) and navigate to the directory where your key pair file is saved.
   - Change the file permissions to ensure it's only readable by you:
     ```bash
     chmod 400 your-key-pair-file.pem
     ```
   - Connect to your instance using SSH:
     ```bash
     ssh -i "your-key-pair-file.pem" ec2-user@your-instance-public-dns
     ```

#### **3. Set Up the Environment on EC2**
1. **Update Packages**:
   ```bash
   sudo yum update -y  # For Amazon Linux
   sudo apt-get update && sudo apt-get upgrade -y  # For Ubuntu
   ```

2. **Install Python and Pip**:
   ```bash
   sudo yum install python3 -y  # For Amazon Linux
   sudo apt-get install python3 python3-pip -y  # For Ubuntu
   ```

3. **Install PostgreSQL**:
   ```bash
   sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs -y  # For Amazon Linux
   sudo apt-get install postgresql postgresql-contrib -y  # For Ubuntu
   ```

4. **Set Up Your Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

5. **Install Required Libraries**:
   ```bash
   pip install flask pandas requests plotly sqlalchemy psycopg2-binary
   ```

#### **4. Transfer Your Project Files to EC2**
1. **Secure Copy (SCP)**: Transfer your project files to the EC2 instance. From your local machine:
   ```bash
   scp -i "your-key-pair-file.pem" -r /path/to/your/project ec2-user@your-instance-public-dns:/home/ec2-user/
   ```

#### **5. Configure and Start Your Flask App**
1. **Set Up PostgreSQL**:
   - Initialize PostgreSQL:
     ```bash
     sudo service postgresql initdb
     ```
   - Start PostgreSQL:
     ```bash
     sudo service postgresql start
     ```
   - Create a new user and database:
     ```bash
     sudo -u postgres createuser --interactive  # Follow prompts to create a user
     sudo -u postgres createdb stock_data  # Create a database
     ```

2. **Update Database Connection String**: In your `app.py` and `etl.py`, update the PostgreSQL connection string to reflect the new database credentials.

3. **Run ETL Script**: Execute your ETL script to populate the database:
   ```bash
   python etl.py
   ```

4. **Start Flask App**:
   ```bash
   flask run --host=0.0.0.0  # This makes the app accessible from any IP address
   ```

### **Step 6: Configure EC2 for Web Access**

#### **1. Install and Configure Gunicorn**
- Gunicorn is a production-ready WSGI server for running Python applications. Install it:
  ```bash
  pip install gunicorn
  ```
- Start Gunicorn:
  ```bash
  gunicorn -w 4 -b 0.0.0.0:8000 app:app  # Adjust the number of workers (-w) as needed
  ```

#### **2. Set Up Nginx (Optional)**
- For better performance and security, you can use Nginx as a reverse proxy. Install Nginx:
  ```bash
  sudo yum install nginx -y  # For Amazon Linux
  sudo apt-get install nginx -y  # For Ubuntu
  ```
- Configure Nginx to proxy requests to Gunicorn. Edit the Nginx configuration file (`/etc/nginx/nginx.conf` or `/etc/nginx/sites-available/default` on Ubuntu):
  ```nginx
  server {
      listen 80;
      server_name your-domain.com;

      location / {
          proxy_pass http://127.0.0.1:8000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```
- Restart Nginx:
  ```bash
  sudo service nginx restart
  ```

### Final Check
- Open your browser and navigate to your EC2 instance's public DNS. You should see your Stocks Dashboard up and running!
