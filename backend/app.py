import asyncio
from flask import Flask
from backend.routes.products import bp as products_bp
from backend.db import init_db, close_db


def create_app():
    app = Flask(__name__)
    app.register_blueprint(products_bp)

    @app.before_request
    def init():
        asyncio.run(init_db())

    @app.teardown_appcontext
    def shutdown(exc):
        asyncio.run(close_db())

    return app

app = create_app()

if __name__ == '__main__':
    app.run(port=5000)
