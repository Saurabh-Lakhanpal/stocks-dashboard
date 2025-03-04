# Stock Dashboard API Documentation

## Introduction
This API allows users to interact with a stock dashboard, providing data about tickers, S&P 500 stocks, and portfolios. It uses Flask for the web framework and SQLAlchemy for database interactions.

## Base URL
- Local Machine: The base URL for all API endpoints is: `http://127.0.0.1:5000` if you run the **appLocal.py**.

- Webapp: The base URL for all API endpoints is: `http://ec2-18-226-222-149.us-east-2.compute.amazonaws.com:8080` if you use **EC2 Backend API**.

## Endpoints

### 1. Get All Tickers
- **URL:** `/api/v1.0/ticker`
- **Method:** `GET`
- **Description:** Retrieve a list of all tickers or information about a specific ticker.
- **Query Parameters:**
  - `ticker` (optional, string): The ticker symbol of the company.
- **Response:**
```json
[
    {
        "ticker": "AAPL",
        "company_name": "Apple Inc."
    },
    ...
]
```
- **Error Responses:**
  - **500 Internal Server Error:** If an error occurs in the server.
  ```json
  {
      "error": "Internal Server Error",
      "message": "Error message details"
  }
  ```

### 2. Get S&P 500 Data
- **URL:** `/api/v1.0/sp500`
- **Method:** `GET`
- **Description:** Retrieve S&P 500 data for a specific date range and optionally for a specific ticker.
- **Query Parameters:**
  - `ticker` (optional, string): The ticker symbol of the company.
  - `start_date` (optional, string, format: YYYY-MM-DD): The start date for the data range.
  - `end_date` (optional, string, format: YYYY-MM-DD): The end date for the data range.
- **Response:**
```json
[
    {
        "date": "2014-01-02",
        "open_price": 183.57,
        "close_price": 184.92,
        "low_price": 181.32,
        "high_price": 186.23,
        "volume": 35000000,
        "ticker": "AAPL"
    },
    ...
]
```
- **Error Responses:**
  - **400 Bad Request:** If the dates are out of range.
  ```json
  {
      "error": "Bad Request",
      "message": "Dates out of range. Valid date range is 2013-02-08 to 2018-02-07"
  }
  ```
  - **500 Internal Server Error:** If an error occurs in the server.
  ```json
  {
      "error": "Internal Server Error",
      "message": "Error message details"
  }
  ```

### 3. Get Portfolio Data
- **URL:** `/api/v1.0/portfolio`
- **Method:** `GET`
- **Description:** Retrieve data for the portfolio.
- **Response:**
```json
[
    {
        "ticker": "AAPL",
        "shares": 50
    },
    ...
]
```
- **Error Responses:**
  - **500 Internal Server Error:** If an error occurs in the server.
  ```json
  {
      "error": "Internal Server Error",
      "message": "Error message details"
  }
  ```

## Error Handling
The API includes custom error handlers for the following HTTP status codes:
- **400 Bad Request**
- **404 Not Found**
- **500 Internal Server Error**

Example error response:
```json
{
    "error": "Error Type",
    "message": "Error message details"
}
```

## Authentication
Currently, this API does not require authentication. It is only accessible for the frontend application via Port Number as a communication endpoint.
```
