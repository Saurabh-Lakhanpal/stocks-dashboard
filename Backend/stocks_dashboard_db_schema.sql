--stocks_dashboard_schema.sql
-- Drop tables if they exist
DROP TABLE IF EXISTS sp500_tb;
DROP TABLE IF EXISTS ticker_tb;
DROP TABLE IF EXISTS portfolio_tb;

-- Create the ticker_tb table
CREATE TABLE ticker_tb (
    ticker VARCHAR(10) PRIMARY KEY,
    company_name VARCHAR(50)
);

-- Create the sp500_tb table
CREATE TABLE sp500_tb (
    date DATE,
    open_price FLOAT,
    close_price FLOAT,
    low_price FLOAT,
    high_price FLOAT,
    volume BIGINT,
    ticker VARCHAR(10)
);

-- Create the portfolio table
CREATE TABLE portfolio_tb(
    ticker VARCHAR(10),
    shares INT,
    FOREIGN KEY (ticker) REFERENCES ticker_tb(ticker)
);

-- Set the date style
SET datestyle = 'ISO, YMD';

