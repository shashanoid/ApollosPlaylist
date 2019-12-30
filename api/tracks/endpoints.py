from flask import Blueprint, abort
from helpers.error import NoTokenError
from helpers.response import endpoint_response, error_endpoint_response
from tracks.track import Track

track_handler = Blueprint('tracks', 'tracks', url_prefix='/tracks')


@track_handler.route('/track', methods=["GET"])
def get_track_data():
    '''
        Get audio features for one or multiple tracks based on their Spotify IDs
    '''
    try:
        return endpoint_response(Track.get_track_data())
    except Exception as e:
        return error_endpoint_response(e)
