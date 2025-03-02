#!/usr/bin/env python
# coding: utf-8

# In[ ]:


#Stocks_dashboard_ETL.ipynb
import os
import zipfile
import pandas as pd
import requests
import psycopg2
from bs4 import BeautifulSoup
from io import StringIO
from sqlalchemy import create_engine
from psycopg2 import sql
import shutil
import stat

# Set the Kaggle configuration directory to a custom path
custom_kaggle_path = '.kaggle'
os.environ['KAGGLE_CONFIG_DIR'] = custom_kaggle_path

# Define paths
zip_file_path = 'Resources/sandp500.zip'
extract_path = 'Resources/sandp500'

# Function to handle permission errors
def handle_remove_readonly(func, path, exc_info):
    os.chmod(path, stat.S_IWRITE)
    func(path)

# Remove existing ZIP file if it exists
if os.path.exists(zip_file_path):
    os.remove(zip_file_path)

# Remove existing folder and its contents if it exists
if os.path.exists(extract_path):
    shutil.rmtree(extract_path, onerror=handle_remove_readonly)

# Download the S&P 500 dataset from Kaggle and store in the Resources folder
os.system('kaggle datasets download -d camnugent/sandp500 -p Resources')

# Unzip the downloaded file
with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

# Load dataset into DataFrame
csv_file_path = os.path.join(extract_path, 'all_stocks_5yr.csv')
df = pd.read_csv(csv_file_path)

# Delete the ZIP file and extracted folder after loading the dataset
os.remove(zip_file_path)
shutil.rmtree(extract_path, onerror=handle_remove_readonly)

# Remove rows with missing values
cleaned_df = df.dropna()

# Convert date column to datetime using .loc
cleaned_df.loc[:, 'date'] = pd.to_datetime(cleaned_df['date'], errors='coerce')

# Drop rows with invalid dates (NaT values)
cleaned_df = cleaned_df.dropna(subset=['date'])

# Rename columns for clarity using .loc
cleaned_df = cleaned_df.rename(columns={'Name': 'ticker', 'date': 'date', 'open': 'open_price', 
                                        'close': 'close_price', 'low': 'low_price', 'high_price': 'high_price', 
                                        'volume': 'volume'})

# Convert date column back to datetime to ensure correct format for PostgreSQL
cleaned_df.loc[:, 'date'] = pd.to_datetime(cleaned_df['date'], format='%Y-%m-%d')

# Display df info
cleaned_df.info()
print('==================================================================================')

# Fetch S&P 500 tickers from Wikipedia
url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'

# Request page content with headers to avoid being blocked
headers = {'User-Agent': 'Mozilla/5.0'}
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    tables = soup.find_all('table', {'class': 'wikitable'}) 
    
    if len(tables) > 0:
        table = tables[0]
        
        # Wrap the table HTML string in a StringIO object
        table_html = StringIO(str(table))
        
        # Read the table directly into a DataFrame using pandas
        ticker_df = pd.read_html(table_html)[0]
        
        # Select only the Ticker Symbol and Company Name columns
        ticker_df = ticker_df[['Symbol', 'Security']]
        
        # Rename columns for clarity
        ticker_df.columns = ['ticker', 'company_name']
        
        # Check for duplicates and drop them
        ticker_df = ticker_df.drop_duplicates()

        # Check for missing/null values and drop rows with any missing values
        ticker_df = ticker_df.dropna()

        # Verify that all tickers in cleaned_df are present in ticker_df
        missing_tickers = cleaned_df[~cleaned_df['ticker'].isin(ticker_df['ticker'])]['ticker'].unique()
        if len(missing_tickers) > 0:
            print(f"Missing tickers in ticker_tb: {missing_tickers}")

        # Display DataFrame info after cleaning
        ticker_df.info()
    else:
        print("Error: S&P 500 company table not found on Wikipedia.")
else:
    print(f"Error: Failed to fetch page, status code {response.status_code}")
print('==================================================================================')

# Define initial and target database parameters
initial_db_params = {
    'dbname': 'postgres',  
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

db_params = {
    'dbname': 'stocks_dashboard_db',  
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

# Functions for database operations
def terminate_sessions(cursor, dbname):
    cursor.execute(sql.SQL("""
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = %s AND pid <> pg_backend_pid();
    """), [dbname])

def drop_database(cursor, dbname):
    cursor.execute("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = %s AND pid <> pg_backend_pid();", [dbname])
    cursor.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(sql.Identifier(dbname)))

def create_database(cursor, dbname):
    cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(dbname)))

def execute_sql_file(cursor, sql_file_path):
    with open(sql_file_path, 'r') as file:
        sql_commands = file.read()
    cursor.execute(sql.SQL(sql_commands))

sql_file_path = 'stocks_dashboard_db_schema.sql'

connection = None
cursor = None

# Connect to the initial database and create the target database
try:
    # Connect to the initial database (postgres)
    connection = psycopg2.connect(**initial_db_params)
    connection.autocommit = True
    cursor = connection.cursor()

    # Drop the target database if it exists
    drop_database(cursor, db_params['dbname'])
    print(f"Database {db_params['dbname']} dropped successfully.")

    # Create the target database
    create_database(cursor, db_params['dbname'])
    print(f"Database {db_params['dbname']} created successfully.")

    # Close the initial connection
    cursor.close()
    connection.close()

    # Connect to the newly created target database (stocks_dashboard_db)
    connection = psycopg2.connect(**db_params)
    cursor = connection.cursor()

    # Execute the SQL schema file to set up the database
    execute_sql_file(cursor, sql_file_path)
    connection.commit()
    print("SQL schema file executed successfully.")

except Exception as e:
    print(f"An error occurred: {e}")
    if connection:
        connection.rollback()

finally:
    if cursor:
        cursor.close()
    if connection:
        connection.close()

# Upload data from DataFrames to PostgreSQL
def upload_df_to_table(connection_string, table_name, df):
    engine = create_engine(connection_string)
    df.to_sql(table_name, engine, if_exists='append', index=False)
    return len(df)

# Ensure column names in cleaned_df and ticker_df match the table schema
ticker_df.columns = ['ticker', 'company_name']
cleaned_df.columns = ['date', 'open_price', 'close_price', 'low_price', 'high_price', 'volume', 'ticker']

# Upload the DataFrames to PostgreSQL tables
connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"

try:
    ticker_rows = upload_df_to_table(connection_string, 'ticker_tb', ticker_df)
    print(f"Data for ticker_tb uploaded successfully. Total rows: {ticker_rows}")
    
    sp500_rows = upload_df_to_table(connection_string, 'sp500_tb', cleaned_df)
    print(f"Data for sp500_tb uploaded successfully. Total rows: {sp500_rows}")

except Exception as e:
    print(f"An error occurred: {e}")

# Add fake data to portfolio_tb
# Create a DataFrame with specific ticker symbols
portfolio_data = {
    'ticker': ['AAPL', 'NVDA', 'AMZN', 'TSLA', 'NFLX', 'MCD'],
    'shares': [50, 30, 40, 25, 35, 45]
}

# Create a DataFrame
portfolio_df = pd.DataFrame(portfolio_data)

# Upload the DataFrame to PostgreSQL
try:
    engine = create_engine(connection_string)
    portfolio_df.to_sql('portfolio_tb', engine, if_exists='append', index=False)
    print(f"Data for portfolio_tb uploaded successfully. Total rows: {len(portfolio_df)}")
except Exception as e:
    print(f"An error occurred: {e}")


# In[4]:


result = cleaned_df.groupby('ticker').agg(
    distinct_date_count=('date', 'nunique'),
    min_date=('date', 'min'),
    max_date=('date', 'max')
).reset_index()

print(result)

