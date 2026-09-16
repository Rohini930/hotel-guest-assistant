from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .routes import api

def create_app():
    load_dotenv()
    app=Flask(__name__)
    CORS(app,resources={r"/api/*":{"origins":"*"}})
    app.register_blueprint(api,url_prefix="/api")
    return app
