## stocks-dashboard-workflow
![image](https://github.com/user-attachments/assets/2f573233-5962-4b13-8003-d18b8658d49b)

1. Install the necessary libraries:
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
6. HTML and CSS:
     - Create an HTML file with a style sheet to create the web pages.
     - HTML to plot the JavaScript D3 plots.
7. [Deploy on AWS](https://github.com/Saurabh-Lakhanpal/stocks-dashboard/blob/main/Project-resources/Installation-Guides/Deploy%20on%20AWS.md)
