# stocks-dashboard

![Page-1](https://github.com/user-attachments/assets/db748ee2-eba3-4c4e-aa63-27a54028041e)
![Page-2](https://github.com/user-attachments/assets/411b34b2-47c8-4f5f-ac1b-d9cc7c1215c6)

### Page 1: **Real-Time Market Overview**

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

### Page 2: **Historical Data Insights of S&P500 2013-2018**

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
  }
  ```

Sources:
1. [S&P 500 stock data](https://www.kaggle.com/datasets/camnugent/sandp500)
2. [S&P 500 Companies list](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies)
3. [YH Finance API](https://financeapi.net/)


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
 
