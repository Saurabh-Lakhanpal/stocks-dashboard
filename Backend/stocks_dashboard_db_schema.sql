-- Create the full_tb table
CREATE TABLE full_tb (
    Ticker VARCHAR(10) PRIMARY KEY,
    Date DATE,
    Open_Price INT,
    Close_Price INT,
    Low_Price INT,
    High_Price INT,
    Volume BIGINT
);

-- Create the ticker_tb table
CREATE TABLE ticker_tb (
    Ticker VARCHAR(10),
    Company_Name VARCHAR(50),
	FOREIGN KEY (Ticker) REFERENCES full_tb(Ticker)
);

CREATE TABLE portfolio(
Ticker VARCHAR(10),
Shares INT
);


-- Set the date style
SET datestyle = 'ISO, YMD';

-- Copy data into the full_tb table
--COPY full_tb (ticker, date, open_price, close_price, low_price, high_price, volume)
--FROM 'C:/Users/bansr/Downloads/proj3BP/proj3BP/Resources/Clean_all_stocks_data_5yrs_cleaned.csv' WITH (FORMAT csv, HEADER);
