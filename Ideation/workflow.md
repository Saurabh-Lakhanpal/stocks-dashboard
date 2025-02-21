## stocks-dashboard-workflow
![image](https://github.com/user-attachments/assets/0abd04e2-7742-4e29-b18c-02afdfd59ffb)

1. Install the necessary libraries using pip:
     ```bash
     pip install flask pandas requests plotly sqlalchemy psycopg2-binary
     ```
2. Prepare and understand the datasets:
     - [Kaggle API](https://www.kaggle.com/datasets/camnugent/sandp500) for S&P 500 stock data for Historical analysis.
     - [YH Finance API](https://financeapi.net/tutorial) for live stocks overview analytics.
     - Either of the [StockGeist API](https://stockgeist.ai/), [Eden AI Sentiment Analysis API](https://www.edenai.co/), [Alpaca News API](https://alpaca.markets/) for Market sentiments gauge.
3. For Historical analysis:
     - Create the ETL Script (Extract, Transform, Load).
     - Use Kaggle API to fetch the csv data.
     - Clean the data, model the data using pandas.
     - Connect to Postgres to load table schema and data into the tables.
     - Also create a fake portfolio table.
4. Create the Flask Backend:
     - Create a new Python file `app.py` for Flask backend.
     - Connect to Postgres to query the tables.
     - Create Flask routes to provide the JSON for Historical data analysis to the frontend.
5. Frontend JavaScript:
     - Create a `app.js` that uses the YH Finance API to produce interactive live graphics.
     - This should also show a fake portfolio using the Flask routes.
     - This should also populate the Historical data analysis using the Flask routes.
6. HTML and Bootstrap:
     - Create an HTML file with a style sheet to create the web pages.
     - HTML to plot the JavaScript D3 plots.
7. Deploy on AWS:
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
         - Create a new key pair or use an existing one. Download the key pair file (.pem) and keep it safe, as it will be needed to connect to your instance.
8. Connect to Your EC2 Instance
     - SSH into Your Instance:
          - Open your terminal (or command prompt on Windows) and navigate to the directory where your key pair file is saved.
          - Change the file permissions to ensure it's only readable by you:
          ```bash
          chmod 400 your-key-pair-file.pem
          ```
          - Connect to your instance using SSH:
          ```bash
          ssh -i "your-key-pair-file.pem" ec2-user@your-instance-public-dns
          ```
9. Set Up the Environment on EC2
     - Update Packages:
     ```bash
     sudo yum update -y  # For Amazon Linux
     sudo apt-get update && sudo apt-get upgrade -y  # For Ubuntu
     ```
     - Install Python and Pip:
     ```bash
     sudo yum install python3 -y  # For Amazon Linux
     sudo apt-get install python3 python3-pip -y  # For Ubuntu
     ```
     - Install PostgreSQL:
     ```bash
     sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs -y  # For Amazon Linux
     sudo apt-get install postgresql postgresql-contrib -y  # For Ubuntu
     ```
     - Set Up Your Virtual Environment:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
     - Install Required Libraries:
     ```bash
     pip install flask pandas requests plotly sqlalchemy psycopg2-binary
     ```
10. Transfer Your Project Files to EC2
     - Secure Copy (SCP): Transfer your project files to the EC2 instance. From your local machine:
     ```bash
     scp -i "your-key-pair-file.pem" -r /path/to/your/project ec2-user@your-instance-public-dns:/home/ec2-user/
     ```
11. Configure and Start Your Flask App
     - Set Up PostgreSQL:
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
     - Update Database Connection String: In your `app.py` and `etl.py`, update the PostgreSQL connection string to reflect the new database credentials.

     - Run ETL Script: Execute your ETL script to populate the database:
     ```bash
     python etl.py
     ```
     - Start Flask App:
     ```bash
     flask run --host=0.0.0.0  # This makes the app accessible from any IP address
     ```

12. Configure EC2 for Web Access
     - Install and Configure Gunicorn:
          - Gunicorn is a production-ready WSGI server for running Python applications. Install it:
     ```bash
     pip install gunicorn
     ```
          - Start Gunicorn:
     ```bash
     gunicorn -w 4 -b 0.0.0.0:8000 app:app  # Adjust the number of workers (-w) as needed
     ```

     - Set Up Nginx (Optional):
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

13. JavaScript to make a POST request to an AWS EC2 server to trigger the execution of a Python Jupyter notebook.
     - Set up a Flask application on your EC2 server that listens for POST requests and triggers the Jupyter notebook execution.
     - Use JavaScript to make a POST request to the Flask API endpoint.
     - On the EC2 server, the Flask API endpoint will handle the POST request and execute the Jupyter notebook using a tool like `papermill` or a subprocess call.
     - Step-by-Step Instructions
          - Install Flask and Required Libraries:
             ```bash
             pip install flask papermill
             ```
               - Create a Flask Application (app.py):
             ```python
             from flask import Flask, request, jsonify
             import subprocess
             app = Flask(__name__)
             @app.route('/run-notebook', methods=['POST'])
             def run_notebook():
                 # Assuming your notebook is named 'notebook.ipynb'
                 notebook_path = 'notebook.ipynb'
                 output_path = 'output.ipynb'
                 try:
                     subprocess.run(['papermill', notebook_path, output_path], check=True)
                     return jsonify({'status': 'success', 'message': 'Notebook executed successfully'}), 200
                     except subprocess.CalledProcessError as e:
             return jsonify({'status': 'error', 'message': str(e)}), 500
                  if __name__ == '__main__':
                 app.run(host='0.0.0.0', port=5000)
             ```
          - Run the Flask Application:**
        ```bash
        python app.py
        ```
          - Make a POST Request with JavaScript
               - JavaScript Code:**
             ```html
             <!DOCTYPE html>
             <html>
             <head>
                 <title>Trigger Jupyter Notebook</title>
                 <script>
                     function runNotebook() {
                         fetch('http://your-ec2-public-dns:5000/run-notebook', {
                             method: 'POST',
                             headers: {
                                 'Content-Type': 'application/json'
                             }
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.status === 'success') {
                                 alert('Notebook executed successfully!');
                             } else {
                                 alert('Error executing notebook: ' + data.message);
                             }
                         })
                         .catch(error => console.error('Error:', error));
                     }
                 </script>
             </head>
             <body>
                 <button onclick="runNotebook()">Run Notebook</button>
             </body>
             </html>
             ```
          - Notes
               - Security Considerations:
                    - Ensure your API endpoint is secured to prevent unauthorized access.
                    - You may want to use authentication and restrict access to the endpoint.
               - AWS Security Group:
                    - Make sure your AWS Security Group allows inbound traffic on port 5000 (or the port you choose for your Flask app).
