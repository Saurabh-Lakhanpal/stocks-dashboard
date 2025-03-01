# Stocks Dashboard

> A comprehensive web application for managing and analyzing stock data in real-time and providing historical stock analysis features.

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
  - Bootstrap (for responsive design)
  
- **Backend**:
  - Python
  - Flask (for handling API requests)
  - Requests (for external API integration)
  - SQLite / PostgreSQL / MySQL (for database management)

- **Data Visualization**:
  - D3.js (for plotting dynamic charts)
  
- **Database**:
  - SQL database (schema defined in `stocks_dashboard_db_schema.sql`)

---

## Features

- **Real-Time Stock Data**: Displays live stock prices, percentage changes, and other real-time stock information.
- **Interactive Charts**: Allows users to visualize stock data using interactive charts (candlestick charts, historical data, etc.).
- **Portfolio Management**: Users can add/remove stocks and view their portfolio's performance.
- **Stock Recommendations**: Based on selected stocks, the dashboard provides recommendations for similar stocks.
- **Historical Data Insights of S&P500 2013-2018**: On Page 2, users can plot historical analysis layers like RSI, Bollinger Bands, and Drawdown charts.
- **Financial Ratios**: Displays various financial ratios (P/E, dividend yield, etc.) for selected stocks.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Getting Started

To get a copy of this project up and running on your local machine for development and testing, follow these simple steps:

### Prerequisites

- Python
- Node.js & npm (optional, for running frontend dependencies)
- A SQL database (e.g., MySQL, PostgreSQL, or SQLite)

### Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repository/stocks-dashboard.git
   cd stocks-dashboard
   ```

2. **Install Backend Dependencies**:
   
   Create a virtual environment (optional, recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

   Install the required Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies** (optional, if using npm):

   ```bash
   npm install
   ```

4. **Set up the Database**:

   - Use the `stocks_dashboard_db_schema.sql` file to create the necessary tables in your database.
   - Modify the connection settings in `app.py` to match your database setup.

5. **Run the Backend**:

   ```bash
   python app.py
   ```

6. **Run the Frontend**:

   Open `index_p1.html` or `index_p2.html` in your web browser to interact with the dashboard.

7. **Run the ETL Pipeline**:

   To populate the database with stock data, open `stocks_dashboard_ETL.ipynb` in Jupyter Notebook and run all the cells to extract, transform, and load stock data.

---

## Directory Structure
```
Stocks-dashboard
├── Backend
│   ├── .kaggle
│   │   └── kaggle.json
│   ├── Resources
│   │   ├── Stock-DB-API-Doc.md
│   │   └── "csv gets downloaded, consumed and purged in this folder" 
│   ├── stocks_dashboard_ETL.ipynb
│   ├── app.py
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
│   │   └── config.js
│   ├── index_p1.js
│   ├── index_p2.js
│   └── index_p3.js
├── Project-resources
│   ├── About-data-analysis.md
│   ├── Installation-Guide.md
│   └── Project-workflow.md
├── .gitignore
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

#### **1. Historical Price Trends**
- **Chart Type:** Candlestick Chart
- **Data Source:** Historical stock prices
- **Filters:** Stock Ticker, Date Range
- **Description:** Analyzes historical price patterns and trends.
- **API Call:** 
  ```url
  https://yfapi.net/v8/finance/chart/{ticker}?range={range}&interval={interval}
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
    - `range`: The date range (e.g., 1y for 1 year)
    - `interval`: The time interval (e.g., 1d for 1 day)
- **JSON Data Example:**
  ```json
  {
    "ticker": "AAPL",
    "historical_data": [
      {
        "date": "2025-02-10",
        "open": 150.00,
        "high": 155.00,
        "low": 149.50,
        "close": 154.00,
        "volume": 1000000
      },
      {
        "date": "2025-02-11",
        "open": 154.50,
        "high": 156.00,
        "low": 152.50,
        "close": 153.00,
        "volume": 1100000
      }
    ]
  }
  ```

#### **1. Financial Ratios**
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
  }```

Sources:
1. [S&P 500 stock data](https://www.kaggle.com/datasets/camnugent/sandp500)
2. [S&P 500 Companies list](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies)
3. [YH Finance API](https://financeapi.net/)

## Technical Requirments
    ```
    flask
    flask-cors
    sqlalchemy
    psycopg2-binary
    pandas
    kaggle - API key
    yfinance - API key
    pandas-datareader
    requests
    beautifulsoup4
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You should refer to the Yahoo! Finance terms of use:
- [Yahoo! Terms of Use](https://www.verizonmedia.com/policies/us/en/verizonmedia/terms/otos/index.html)
- [Yahoo! Privacy Policy](https://www.verizonmedia.com/policies/us/en/verizonmedia/privacypolicy/index.html)

For more information, you can check out the following:
- [S&P 500 stock data](https://www.kaggle.com/datasets/camnugent/sandp500)
- [S&P 500 Companies list](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies)
- [YH Finance API](https://financeapi.net/)

---

## Acknowledgements

- **D3.js**: JavaScript library for creating dynamic, interactive data visualizations.
- **Flask**: A lightweight Python web framework used to serve API requests.
- **pandas**: Python library used for data manipulation and analysis.
- **Bootstrap**: Frontend framework used for responsive design.
- **Jupyter**: Used for running the ETL pipeline and processing stock data.

---

With this **Stocks Dashboard**, you can manage your stock portfolio, analyze stock performance, and get valuable insights into market trends. 

---

