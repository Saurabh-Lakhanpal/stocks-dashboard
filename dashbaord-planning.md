# stocks-dashboard

![Portfolio](https://github.com/user-attachments/assets/d2b7fe0c-52f4-4352-81da-a7681c3c87b0)

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

#### **2. Market Sentiment Analysis**
- **Chart Type:** Bar Chart
- **Data Source:** Market sentiment data from social media/news
- **Filters:** Stock Ticker, Date Range
- **Description:** Shows the sentiment (positive, negative, neutral) around selected stocks.
- **API Call:** This feature is not directly available through the Yahoo Finance API, but you can use third-party APIs like:
  - **StockGeist API:** 
    ```url
    https://api.stockgeist.ai/v1/sentiment/{ticker}
    ```
    - **Parameters:**
      - `ticker`: The stock ticker symbol (e.g., AAPL)
    - **JSON Data Example:**
      ```json
      {
        "ticker": "AAPL",
        "sentiment": [
          {
            "date": "2025-02-13",
            "positive": 60,
            "negative": 20,
            "neutral": 20
          },
          {
            "date": "2025-02-12",
            "positive": 55,
            "negative": 25,
            "neutral": 20
          }
        ]
      }
      ```
  - **Eden AI Sentiment Analysis API:** 
    ```url
    https://api.edenai.co/v1/sentiment_analysis
    ```
    - **Parameters:**
      - `text`: The text to analyze (e.g., news articles, social media posts)
    - **JSON Data Example:**
      ```json
      {
        "text": "Apple's stock is performing well.",
        "sentiment": "positive",
        "confidence": 0.95
      }
      ```
  - **Alpaca News API:** 
    ```url
    https://newsapi.alpaca.markets/v1/sentiment/{ticker}
    ```
    - **Parameters:**
      - `ticker`: The stock ticker symbol (e.g., AAPL)
    - **JSON Data Example:**
      ```json
      {
        "ticker": "AAPL",
        "sentiment": [
          {
            "date": "2025-02-13",
            "positive": 60,
            "negative": 20,
            "neutral": 20
          },
          {
            "date": "2025-02-12",
            "positive": 55,
            "negative": 25,
            "neutral": 20
          }
        ]
      }
      ```

#### **3. Volume Analysis**
- **Chart Type:** Area Chart
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
### Page 2: **Historical Data Insights**

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

#### **2. Moving Averages**
- **Chart Type:** Line Chart
- **Data Source:** Historical stock prices
- **Filters:** Stock Ticker, Date Range, Moving Average Period (e.g., 50-day, 200-day)
- **Description:** Shows the moving averages over selected periods.
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
    "date": ["2025-01-01", "2025-01-02", "2025-01-03"],
    "closing_price": [150.00, 152.00, 151.00],
    "moving_average_50": [149.00, 150.00, 150.50],
    "moving_average_200": [148.00, 148.50, 149.00]
  }
  ```

#### **3. Volume Over Time**
- **Chart Type:** Bar Chart
- **Data Source:** Historical trading volumes
- **Filters:** Stock Ticker, Date Range
- **Description:** Visualizes trading volumes over time.
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
    "date": ["2025-01-01", "2025-01-02", "2025-01-03"],
    "volume": [1000000, 1200000, 1100000]
  }
  ```
### Page 3: **Financial Health and Ratios**

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

#### **2. Revenue and Earnings**
- **Chart Type:** Line Chart
- **Data Source:** Financial statement data
- **Filters:** Stock Ticker, Date Range
- **Description:** Tracks revenue and earnings over time.
- **API Call:** 
  ```url
  https://yfapi.net/v11/finance/quoteSummary/{ticker}?modules=earnings,financialData
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
- **JSON Data Example:**
  ```json
  {
    "ticker": "AAPL",
    "financials": [
      {
        "date": "2025-02-13",
        "revenue": 100000000,
        "earnings": 25000000
      },
      {
        "date": "2025-01-13",
        "revenue": 95000000,
        "earnings": 24000000
      }
    ]
  }
  ```

#### **3. Dividend Analysis**
- **Chart Type:** Pie Chart
- **Data Source:** Dividend data
- **Filters:** Stock Ticker, Date Range
- **Description:** Shows the distribution of dividends for selected stocks.
- **API Call:** 
  ```url
  https://yfapi.net/v11/finance/quoteSummary/{ticker}?modules=summaryDetail
  ```
  - **Parameters:**
    - `ticker`: The stock ticker symbol (e.g., AAPL)
- **JSON Data Example:**
  ```json
  {
    "ticker": "AAPL",
    "dividends": [
      {
        "date": "2025-02-01",
        "amount": 0.20
      },
      {
        "date": "2025-01-01",
        "amount": 0.18
      }
    ]
  }
  ```

APIs:
1. [Google Finance API](https://algotrading101.com/learn/google-finance-api-guide/)
2. [Yahoo Finance API Guide - AlgoTrading101](https://algotrading101.com/learn/yahoo-finance-api-guide/): This guide provides a comprehensive overview of the Yahoo Finance API, including how to access historical and real-time data.
3. [Yahoo Developer Network - APIs](https://developer.yahoo.com/api/): This page includes documentation for various Yahoo APIs, including the Yahoo Finance API.
4. [YH Finance - RapidAPI](https://rapidapi.com/sparior/api/yahoo-finance15): This page offers detailed information on how to use the Yahoo Finance API through RapidAPI.

Here are the links to sign up for the API keys:
1. [Yahoo Finance API](https://www.yahoofinanceapi.com/)
2. [StockGeist API](https://stockgeist.ai/)
3. [Eden AI Sentiment Analysis API](https://www.edenai.co/)
4. [Alpaca News API](https://alpaca.markets/)
