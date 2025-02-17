## stocks-dashboard-workflow

![image](https://github.com/user-attachments/assets/cc031516-adec-4da4-9e99-c76fd9247243)

### Workflow Summary with API Calls

### **Step 1: Set Up Your Environment**
1. **Install Python**:
   - Download and install Python from [python.org](https://www.python.org/). Make sure to add Python to your PATH during installation.

2. **Set Up a Virtual Environment**:
   - Open your terminal or command prompt and create a new directory for your project:
     ```bash
     mkdir stocks_dashboard
     cd stocks_dashboard
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```bash
       venv\Scripts\activate
       ```
     - On macOS/Linux:
       ```bash
       source venv/bin/activate
       ```

3. **Install Required Libraries**:
   - Install the necessary Python libraries using pip:
     ```bash
     pip install flask pandas requests plotly sqlalchemy psycopg2-binary
     ```

### **Step 2: Choose Your Dataset**
1. **Get an API Key**:
   - Sign up for the required API keys from [Yahoo Finance](https://www.yahoofinanceapi.com/) and other third-party APIs like StockGeist, Eden AI, and Alpaca.

### **Step 3: Create the ETL Script (Extract, Transform, Load)**
1. **Extract Data**:
   - Create a Python script to fetch data from the Yahoo Finance API. Save it as `etl.py`:
     ```python
     import requests
     import pandas as pd
     from sqlalchemy import create_engine

     API_KEY = 'YOUR_API_KEY'
     symbol = 'AAPL'
     url = f'https://yfapi.net/v8/finance/chart/{symbol}?interval=1m&range=1d'

     headers = {'x-api-key': API_KEY}
     response = requests.get(url, headers=headers)
     data = response.json()
     ```

2. **Transform Data**:
   - Clean and organize the data using Pandas:
     ```python
     # Transform the data
     df = pd.DataFrame.from_dict(data['chart']['result'][0]['indicators']['quote'][0])
     df['timestamp'] = pd.to_datetime(data['chart']['result'][0]['timestamp'], unit='s')
     df.set_index('timestamp', inplace=True)
     ```

3. **Load Data**:
   - Save the data into a PostgreSQL database. First, make sure you have PostgreSQL installed and create a database named `stock_data`:
     ```python
     # Load data into PostgreSQL
     engine = create_engine('postgresql://username:password@localhost/stock_data')
     df.to_sql(symbol, engine, if_exists='replace')
     ```

### **Step 4: Create the Flask Backend**
1. **Set Up Flask**:
   - Create a new Python file named `app.py` for your Flask backend:
     ```python
     from flask import Flask, jsonify
     from sqlalchemy import create_engine
     import pandas as pd

     app = Flask(__name__)
     engine = create_engine('postgresql://username:password@localhost/stock_data')

     @app.route('/data/<symbol>')
     def get_data(symbol):
         query = f'SELECT * FROM {symbol}'
         df = pd.read_sql(query, engine)
         return jsonify(df.to_dict(orient='records'))

     if __name__ == '__main__':
         app.run(debug=True)
     ```

### **Step 5: Create the Front-End**
1. **Set Up HTML and Bootstrap**:
   - Create an HTML file named `index.html` in a directory called `templates`:
     ```html
     <!DOCTYPE html>
     <html>
     <head>
         <title>Stocks Dashboard</title>
         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
         <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
     </head>
     <body>
         <div class="container">
             <h1>Stocks Dashboard</h1>
             <div id="real-time-stock-performance"></div>
             <div id="market-sentiment-analysis"></div>
             <div id="volume-analysis"></div>
         </div>

         <script>
             // Real-Time Stock Performance
             fetch('/data/AAPL')
                 .then(response => response.json())
                 .then(data => {
                     const timestamps = data.map(row => row.timestamp);
                     const prices = data.map(row => row.close);

                     const trace = {
                         x: timestamps,
                         y: prices,
                         type: 'scatter'
                     };

                     const layout = {
                         title: 'AAPL Real-Time Stock Performance',
                         xaxis: { title: 'Time' },
                         yaxis: { title: 'Price' }
                     };

                     Plotly.newPlot('real-time-stock-performance', [trace], layout);
                 });
         </script>
     </body>
     </html>
     ```

### **Step 6: Integrate Front-End and Back-End**
1. **Update Flask App to Serve HTML**:
   - Modify `app.py` to serve the HTML file:
     ```python
     from flask import Flask, render_template, jsonify
     from sqlalchemy import create_engine
     import pandas as pd

     app = Flask(__name__)
     engine = create_engine('postgresql://username:password@localhost/stock_data')

     @app.route('/')
     def index():
         return render_template('index.html')

     @app.route('/data/<symbol>')
     def get_data(symbol):
         query = f'SELECT * FROM {symbol}'
         df = pd.read_sql(query, engine)
         return jsonify(df.to_dict(orient='records'))

     if __name__ == '__main__':
         app.run(debug=True)
     ```
### **Step 7: Deploy on AWS**

#### **1. Set Up an EC2 Instance**
1. **Create an AWS Account**:
   - If you don't have an AWS account, sign up at [aws.amazon.com](https://aws.amazon.com/).

2. **Launch an EC2 Instance**:
   - Log in to your AWS Management Console.
   - Navigate to the **EC2 Dashboard**.
   - Click on **Launch Instance**.

3. **Configure Instance**:
   - **Choose an Amazon Machine Image (AMI)**: Select the **Amazon Linux 2 AMI** (or Ubuntu if you prefer).
   - **Instance Type**: Select the **t2.micro** instance type, which is free-tier eligible.
   - **Configure Instance Details**: You can leave the default settings here.
   - **Add Storage**: The default storage settings should be sufficient.
   - **Add Tags**: Optionally, add a tag to identify your instance.
   - **Configure Security Group**:
     - Create a new security group with the following rules:
       - **SSH**: Port 22 from your IP address.
       - **HTTP**: Port 80 from anywhere.
     - Review and launch your instance.

4. **Key Pair**:
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
