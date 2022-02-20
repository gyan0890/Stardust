from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    cors = CORS(app) 
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['RESTX_ERROR_404_HELP'] = False
    
    return app

