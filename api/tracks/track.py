import json
import spotipy
from flask import request

from db import db
from helpers.error import NoTokenError


class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    @staticmethod
    def get_track_data():
        token = request.args.get('token')
        if not token:
            raise NoTokenError

        sp = spotipy.Spotify(auth=token)

        return sp.audio_features(request.args.get('track_id'))
