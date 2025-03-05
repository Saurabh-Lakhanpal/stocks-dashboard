# Stocks Dashboard

> A comprehensive web application for managing and analyzing stock data in real-time and providing historical stock analysis features.
> [stocks-dashboard full webapp on AWS EC2 Linux](https://ec2-18-226-222-149.us-east-2.compute.amazonaws.com/index.html)
## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Documentation

- [S&P 500 Backend API](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/Stock-DB-API-Doc.md)
- [Installation Guides](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/tree/main/Project-resources/Installation-Guides)
- [requirements.txt](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/Installation-Guides/requirements.txt)
- [S&P 500 Data Analysis Understanding](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/About-data-analysis.md)
- [Workflow and Ideation of this project](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/Project-workflow.md)
- [Postgres ERD](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/ERD.md)

---

## Project Overview

The **Stocks Dashboard** is a dynamic web application that allows users to manage their stock portfolios, analyze real-time stock data, and visualize various financial metrics. The application integrates with various APIs to provide real-time stock data and allows users to select stocks, view historical data, and perform historical technical analysis.

This project consists of two main pages:
1. **Page 1 (Stock Overview)**: View and manage selected stocks, track portfolio performance, and visualize real-time stock data.


![Page-1](https://github.com/user-attachments/assets/db748ee2-eba3-4c4e-aa63-27a54028041e)


2. **Page 2 (Historical Stock Analysis)**: Plot historical stock data layers (e.g., RSI, Bollinger Bands), analyze stock health, and view various financial ratios.


![Page-2](https://github.com/user-attachments/assets/411b34b2-47c8-4f5f-ac1b-d9cc7c1215c6)
---

## Technologies Used

- **Frontend**:
  - HTML
  - CSS
  - JavaScript (with D3.js for data visualization)
  
- **Backend**:
  - Python
  - Flask (for handling API requests)
  - Requests (for external API integration)
  - SQLite / PostgreSQL / MySQL (for database management)

- **Data Visualization**:
  - D3.js (for plotting dynamic charts)
  
- **Database**:
  - SQL database (schema defined in `stocks_dashboard_db_schema.sql`)

  - **AWS Deployment**:
  - AWS EC2 Linux Instance for the S&P 500 Historical Data.
  - Github Pages for Frontend.

---

## Features

- **Real-Time Stock Data**: Displays live stock prices, percentage changes, and other real-time stock information.
- **Interactive Charts**: Allows users to visualize stock data using interactive charts (candlestick charts, historical data, etc.).
- **Stock Recommendations**: Based on selected stocks, the dashboard provides recommendations for similar stocks.
- **Historical Data Insights of S&P500 2013-2018**: On Page 2, users can plot historical analysis layers like RSI, Bollinger Bands, and Drawdown charts.
- **Financial Ratios**: Displays various financial ratios (P/E, dividend yield, etc.) for selected stocks.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Getting Started
- [Deploy on Local Machine](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/Installation-Guides/Deploy%20on%20Local.md)
- [Deploy on your own EC2 instance](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/Installation-Guides/Deploy%20on%20AWS.md)

---

## Directory Structure
```
Stocks-dashboard
├── Backend
│   ├── .kaggle
│   │   └── kaggle.json
│   ├── Resources
│   │   ├── stocks.csv
│   │   └── "csv gets downloaded, consumed and purged in this folder" 
│   ├── stocks_dashboard_ETL.ipynb
│   ├── app.py
│   ├── appLocal.py
│   ├── etl.py 
│   ├── stocks_dashboard_db_schema.sql      
│   │       
├── Frontend
│   ├── assets
│   │   ├── Amazon.svg
│   │   ├── Logo.svg
│   │   ├── apple.svg
│   │   ├── mcdonalds.svg
│   │   ├── netflix.svg
│   │   ├── nvidia.svg
│   │   ├── refresh.svg
│   │   └── tesla.svg
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── p1_scripts
│   │   │   ├── events_p1.js
│   │   │   ├── layers_p1.js
│   │   │   ├── plot_p1.js
│   │   │   ├── portfolio_p1.js.js
│   │   │   ├── recommendations_p1.js
│   │   │   └── UIscripts_p1.js
│   │   ├── p2_scripts
│   │   │   ├── events_p2.js
│   │   │   ├── plots_p2.js
│   │   │   ├── ratios_p2.js
│   │   │   ├── scripts_p2.js
│   │   │   ├── UIscripts_p2.js
│   │   │   └── verifyTicker_p2.js
│   │   ├── url.js
│   │   └── config.js
├── Project-resources
│   ├── About-data-analysis.md
│   ├── Installation-Guides
│   │   ├── requirements.txt
│   │   ├── Stock-DB-API-Doc.md
│   │   ├── ERD.md
│   │   ├── Deploy on Local
│   │   └── Deploy on AWS
│   └── Project-workflow.md
├── .gitignore
├── index_p1.html
├── index_p2.html
├── LICENSE
└── README.md

```

---

## Usage

### Page 1 - Real-Time Market Overview

#### **1. Real-Time Stock Performance**
- **Chart Type:** Line Chart
- **Data Source:** Real-time stock prices
- **Filters:** Stock Ticker, Time Interval (e.g., 1 min, 5 min)
- **Description:** Visualizes real-time price movements of selected stocks.
- **API Call:** 
  ```url
  https://yfapi.net/v8/finance/chart/{ticker}?interval={interval}
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
    - `interval`: The time interval (e.g., 1m for 1 minute)
- **JSON Data Example:**
  ```json
  {
    "ticker": "AAPL",
    "timestamp": ["2025-02-13T21:00:00Z", "2025-02-13T21:01:00Z", "2025-02-13T21:02:00Z"],
    "price": [150.50, 150.75, 150.60]
  }
  ```
#### **2. Volume Analysis**
- **Chart Type:** Bar Chart
- **Data Source:** Real-time trading volumes
- **Filters:** Stock Ticker, Time Interval
- **Description:** Displays trading volumes for selected stocks.
- **API Call:** 
  ```url
  https://yfapi.net/v8/finance/chart/{ticker}?interval={interval}
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
    - `interval`: The time interval (e.g., 1m for 1 minute)
- **JSON Data Example:**
  ```json
  {
    "ticker": "AAPL",
    "timestamp": ["2025-02-13T21:00:00Z", "2025-02-13T21:01:00Z", "2025-02-13T21:02:00Z"],
    "volume": [2000, 2500, 2300]
  }
  ```
#### **3. Recommendation**
- **Chart Type:** Table
- **Data Source:** Real-time trading volumes
- **Filters:** Stock Ticker, Time Interval
- **Description:** Recommendation of Tickers that are preferred buy along with the selected ticker.
- **API Call:** 
  ```url
    https://yfapi.net/v6/finance/recommendationsbysymbol/${ticker}
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
- **JSON Data Example:**
    ```json
  {
    "finance": {
      "error": null,
      "result": [
        {
          "recommendedSymbols": [
            {
              "score": 0.284219,
              "symbol": "AMZN"
            }
          ],
          "symbol": "AAPL"
        }
      ]
    }
  }
  ```

### Page 2 - Historical Data Insights of S&P500 2013-2018

#### **1. Historical Price Trends (Closing Price)**
- **Chart Type:*Line Chart* 
- **Data Source:** Historical stock prices
- **Filters:** Stock Ticker
- **Description:** Analyzes historical price patterns and trends.

#### **2. Relative Strength Index (RSI)**
- **Chart Type:*Scatter Plot* 
- **Data Source:** Historical stock prices
- **Filters:** Stock Ticker
- **Description:**  Momentum oscillator that measures the speed and magnitude of recent price changes.

#### **3. Bollinger Bands**
- **Chart Type:*Line Chart* 
- **Data Source:** Historical stock prices
- **Filters:** Stock Ticker
- **Description:** Visual indicator of stock price volatility.

#### **4. Drawdown Chart**
- **Chart Type:*Area Plot* 
- **Data Source:** Historical stock prices
- **Filters:** Stock Ticker
- **Description:** Percentage decline of the stock price from its previous peak over a specific period of time.

- **API Call:** 
  ```url
  http://ec2-18-226-222-149.us-east-2.compute.amazonaws.com:8080/api/v1.0/sp500?ticker={ticker}&start_date=2014-01-01&end_date=2015-01-01
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
- **JSON Data Example:**
  ```json
  [
    {
      "date": "2014-01-02",
      "open_price": 79.3828,
      "close_price": 79.0185,
      "low_price": 78.8601,
      "high_price": 79.5756,
      "volume": 58791957,
      "ticker": "AAPL"
    },
    ...
  ]
  ```

#### **5. Financial Ratios**
- **Chart Type:** Bar Chart
- **Data Source:** Financial statement data
- **Filters:** Stock Ticker, Financial Metric
- **Description:** Displays key financial ratios such as P/E Ratio, Debt-to-Equity Ratio, etc.
- **API Call:** 
  ```url
  https://yfapi.net/v11/finance/quoteSummary/{ticker}?modules=summaryDetail,financialData
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
- **JSON Data Example:**
  ```json
  {
    "ticker": "AAPL",
    "financial_ratios": [
      {
        "metric": "P/E Ratio",
        "value": 25.6
      },
      {
        "metric": "Debt-to-Equity Ratio",
        "value": 1.5
      }
    ]
  }
  ```

Data Sources:
1. [S&P 500 stock data](https://www.kaggle.com/datasets/camnugent/sandp500)
2. [S&P 500 Companies list](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies)
3. [YH Finance API](https://financeapi.net/)

## Technical Requirments
  ```
  Kaggle
  pandas
  sqlalchemy
  psycopg2-binary
  yfinance
  pandas_datareader
  requests
  beautifulsoup4
  flask
  flask_cors
  python-dateutil==2.8.2
  notebook
  nbconvert
  jupyterlab
  sudo yum install postgresql15 postgresql15-server -y
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You should refer to the Yahoo! Finance terms of use:
- [Yahoo! Terms of Use](https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html)
- [Yahoo! Privacy Policy](https://legal.yahoo.com/us/en/yahoo/privacy/index.html)

For more information, you can check out the following:
- [S&P 500 stock data](https://www.kaggle.com/datasets/camnugent/sandp500)
- [S&P 500 Companies list](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies)
- [YH Finance API](https://financeapi.net/)

---

## Acknowledgements

- **D3.js**: JavaScript library for creating dynamic, interactive data visualizations.
- **Flask**: A lightweight Python web framework used to serve API requests.
- **pandas**: Python library used for data manipulation and analysis.
- **Jupyter**: Used for running the ETL pipeline and processing stock data.

---

With this **Stocks Dashboard**, analyze stock performance, and get valuable insights into market trends. 

---

## Group 3 - Project Team
- Asif Shehzad
- Bansri Patel
- Evan Gowans
- Saurabh Lakhanpal

---

## Team Presentation
[![Presentation](https://github.com/user-attachments/assets/f4d8e0a3-627a-48ff-9194-d0a66bfee1f5)](https://prezi.com/p/tla986dney5v/?present=1)
