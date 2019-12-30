import json
from flask import Flask, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from db import init_database
from users.endpoints import user_handler
from tracks.endpoints  import track_handler
from playlists.endpoints import playlists_handler
# All main routes will through this handler

# App definition should be outside of handler for using the 'flask' commansd
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')


class Handler:
    app = app
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)
    db = init_database(app)
    migrate = Migrate(app, db)
    app.app_context().push()
    app.register_blueprint(playlists_handler)
    app.register_blueprint(track_handler)
    app.register_blueprint(user_handler)

    def __init__(self):
        return None


if __name__ == '__main__':
    import logging
    logging.basicConfig(filename='error.log', level=logging.DEBUG)
    handler = Handler()
    handler.db.create_all()

    # When running locally use
    handler.app.run(host="localhost", port=8000, debug=True)

    # For production, comment above and push with host mentioned below
    #app.run(host='0.0.0.0')
