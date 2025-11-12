# ~/sanhaak/Sample/backend/routes/__init__.py
from flask import Flask
from .routes.explain import explain_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(explain_bp)

    return app
