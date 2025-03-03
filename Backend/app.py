# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, func, Table, MetaData
from sqlalchemy.orm import Session, declarative_base
import datetime as dt
from collections import OrderedDict
import json

# Database Setup
db_params = {
    'dbname': 'stocks_dashboard_db',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
engine = create_engine(connection_string)
Base = declarative_base()
metadata = MetaData()

# Explicitly declare tables
Ticker = Table('ticker_tb', metadata, autoload_with=engine)
SP500 = Table('sp500_tb', metadata, autoload_with=engine)
Portfolio = Table('portfolio_tb', metadata, autoload_with=engine)

# Flask Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS

# Error Handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request", "message": str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": str(error)}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error", "message": str(error)}), 500

@app.route("/")
def welcome():
    """List all available API routes."""
    return (
        f"<h2>Available Routes on this Portal:</h2>"
        f"<ul>"
        f"<li><a href='/api/v1.0/ticker'>/api/v1.0/ticker</a> - Get all tickers</li>"
        f"<li><a href='/api/v1.0/sp500?start_date=2014-01-01&end_date=2015-01-01'>/api/v1.0/sp500</a> - Get all S&P 500 data for a specific date range</li>"
        f"<li><a href='/api/v1.0/portfolio'>/api/v1.0/portfolio</a> - Get all portfolio data</li>"
        f"</ul>"
        f"<p>Example call for date range: <a href='/api/v1.0/sp500?start_date=2014-01-01&end_date=2015-01-01'>/api/v1.0/sp500?start_date=2014-01-01&end_date=2015-01-01</a></p>"
        f"<p>Example call for ticker: <a href='/api/v1.0/ticker?ticker=AAPL'>/api/v1.0/ticker?ticker=AAPL</a> - Get company name by ticker (example for AAPL)</p>"
        f"<p>Example call for S&P 500 data by ticker: <a href='/api/v1.0/sp500?ticker=AAPL&start_date=2014-01-01&end_date=2015-01-01'>/api/v1.0/sp500?ticker=AAPL&start_date=2014-01-01&end_date=2015-01-01</a> - Get S&P 500 data for AAPL within a specific date range</p>"
    )

@app.route("/api/v1.0/ticker")
def get_ticker_data():
    session = Session(engine)
    ticker_symbol = request.args.get('ticker', default=None, type=str)
    
    try:
        if ticker_symbol:
            results = session.query(Ticker).filter(Ticker.c.ticker == ticker_symbol).all()
        else:
            results = session.query(Ticker).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    tickers = []
    for ticker in results:
        ticker_dict = OrderedDict({
            "ticker": ticker.ticker,
            "company_name": ticker.company_name
        })
        tickers.append(ticker_dict)

    return app.response_class(
        response=json.dumps(tickers, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api/v1.0/sp500")
def get_sp500_data():
    session = Session(engine)
    try:
        # Get ticker symbol from query parameters
        ticker_symbol = request.args.get('ticker', default=None, type=str)
        
        # Get date range from query parameters
        start_date = request.args.get('start_date', default='2013-02-08', type=str)
        end_date = request.args.get('end_date', default='2018-02-07', type=str)

        # Convert start_date and end_date to datetime objects
        start_date = dt.datetime.strptime(start_date, '%Y-%m-%d')
        end_date = dt.datetime.strptime(end_date, '%Y-%m-%d')

        # Check if dates are within the valid range
        if start_date < dt.datetime(2013, 2, 8) or end_date > dt.datetime(2018, 2, 7):
            return jsonify({"error": "Dates out of range. Valid date range is 2013-02-08 to 2018-02-07"}), 400

        # Query data within the specified date range and optional ticker symbol
        if ticker_symbol:
            results = session.query(SP500).filter(SP500.c.date >= start_date, SP500.c.date <= end_date, SP500.c.ticker == ticker_symbol).all()
        else:
            results = session.query(SP500).filter(SP500.c.date >= start_date, SP500.c.date <= end_date).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    sp500_data = []
    for data in results:
        sp500_dict = OrderedDict({
            "date": data.date.strftime('%Y-%m-%d'),  # Convert date to string
            "open_price": data.open_price,
            "close_price": data.close_price,
            "low_price": data.low_price,
            "high_price": data.high_price,
            "volume": data.volume,
            "ticker": data.ticker
        })
        sp500_data.append(sp500_dict)

    return app.response_class(
        response=json.dumps(sp500_data, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api/v1.0/portfolio")
def get_portfolio_data():
    session = Session(engine)
    try:
        results = session.query(Portfolio).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    portfolio_data = []
    for data in results:
        portfolio_dict = OrderedDict({
            "ticker": data.ticker,
            "shares": data.shares
        })
        portfolio_data.append(portfolio_dict)

    return jsonify(portfolio_data)

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8080, debug=True)

