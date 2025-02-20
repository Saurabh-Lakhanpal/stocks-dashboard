# Import necessary modules
import subprocess
import sys
from flask import Flask, jsonify
from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
import datetime as dt
from collections import OrderedDict
import json

# Ensure psycopg2 is installed
# try:
#     import psycopg2
# except ImportError:
#     subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
#     import psycopg2

# Database Setup
db_params = {
    'dbname': 'crowdfunding_db',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
engine = create_engine(connection_string)
Base = automap_base()
Base.prepare(autoload_with=engine)
Campaign = Base.classes.campaign_tb
Country = Base.classes.countries_tb
Contact = Base.classes.contacts_tb
Subcategory = Base.classes.subcategory_tb
Category = Base.classes.category_tb

# Flask Setup
app = Flask(__name__)

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
        f"<li><a href='/api/v1.0/campaigns'>/api/v1.0/campaigns</a> - Get all campaigns</li>"
        f"<li><a href='/api/v1.0/countries'>/api/v1.0/countries</a> - Get all countries</li>"
        f"<li><a href='/api/v1.0/contacts'>/api/v1.0/contacts</a> - Get all contacts</li>"
        f"<li><a href='/api/v1.0/subcategories'>/api/v1.0/subcategories</a> - Get all subcategories</li>"
        f"<li><a href='/api/v1.0/categories'>/api/v1.0/categories</a> - Get all categories</li>"
        f"</ul>"
    )

@app.route("/api/v1.0/campaigns")
def get_campaigns():
    session = Session(engine)
    try:
        results = session.query(Campaign).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    campaigns = []
    for campaign in results:
        campaign_dict = OrderedDict({
            "cf_id": campaign.cf_id,
            "contact_id": campaign.contact_id,
            "company_name": campaign.company_name,
            "description": campaign.description,
            "goal": campaign.goal,
            "pledged": campaign.pledged,
            "outcome": campaign.outcome,
            "backers_count": campaign.backers_count,
            "country": campaign.country,
            "currency": campaign.currency,
            "launch_date": campaign.launch_date.strftime('%Y-%m-%d'),  # Convert date to string
            "end_date": campaign.end_date.strftime('%Y-%m-%d'),        # Convert date to string
            "category_id": campaign.category_id,
            "subcategory_id": campaign.subcategory_id
        })
        campaigns.append(campaign_dict)

    return app.response_class(
        response=json.dumps(campaigns, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api/v1.0/countries")
def get_countries():
    session = Session(engine)
    try:
        results = session.query(Country).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    countries = []
    for country in results:
        country_dict = OrderedDict({
            "country": country.country,
            "currency": country.currency
        })
        countries.append(country_dict)

    return app.response_class(
        response=json.dumps(countries, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api/v1.0/contacts")
def get_contacts():
    session = Session(engine)
    try:
        results = session.query(Contact).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    contacts = []
    for contact in results:
        contact_dict = OrderedDict({
            "contact_id": contact.contact_id,
            "first_name": contact.first_name,
            "last_name": contact.last_name,
            "email": contact.email
        })
        contacts.append(contact_dict)

    return app.response_class(
        response=json.dumps(contacts, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api/v1.0/subcategories")
def get_subcategories():
    session = Session(engine)
    try:
        results = session.query(Subcategory).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    subcategories = []
    for subcategory in results:
        subcategory_dict = OrderedDict({
            "subcategory_id": subcategory.subcategory_id,
            "subcategory": subcategory.subcategory
        })
        subcategories.append(subcategory_dict)

    return app.response_class(
        response=json.dumps(subcategories, sort_keys=False),
        mimetype='application/json'
    )

@app.route("/api/v1.0/categories")
def get_categories():
    session = Session(engine)
    try:
        results = session.query(Category).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

    categories = []
    for category in results:
        category_dict = OrderedDict({
            "category_id": category.category_id,
            "category": category.category
        })
        categories.append(category_dict)

    return app.response_class(
        response=json.dumps(categories, sort_keys=False),
        mimetype='application/json'
    )

if __name__ == '__main__':
    app.run(debug=True)
