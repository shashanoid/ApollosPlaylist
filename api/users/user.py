import json
import spotipy
from flask import request

from db import db
from helpers.error import NoTokenError, ServerError


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    spotify_id = db.Column(db.String(255), unique=True)

    @staticmethod
    def current_user_top_tracks():
        token = request.args.get('token')

        if token is None:
            raise NoTokenError

        sp = spotipy.Spotify(auth=token)
        results = sp.current_user_top_tracks(time_range="short_term")

        top_tracks = []

        for track in results["items"]:
                    track_name = track["name"]
                    artists = ""
                    for artist in track['artists']:
                        artists = artist['name'] + ", "
                        
                    track_image = track['album']['images'][0]['url']
                    preview_url = sp.track(track['id'])['preview_url']

                    # Popping ', ' with artists[:-2] so extra ones don't get added
                    top_tracks.append({'name': track_name, 'artists': artists[:-2], 'image': track_image, 'preview_url': preview_url})
        
        return top_tracks

    @staticmethod
    def current_user_playlists():
        token = request.args.get('token')
        if token is None:
            raise NoTokenError

        sp = spotipy.Spotify(auth=token)
        playlists = []
        playlists_response = sp.current_user_playlists(limit=50)

        all_playlists = True
        offset = 0

        if playlists_response['next'] is not None:
            all_playlists = False

        playlists += playlists_response['items']

        while(not all_playlists):
            more_playlists = sp.current_user_playlists(
                offset=offset + 50, limit=50)
            playlists += more_playlists['items']
            offset = more_playlists['offset']

            if more_playlists['next'] is None:
                all_playlists = True

        filtered_playlists = filter(lambda playlist: playlist['collaborative']
                                    or playlist['owner']['id'] == sp.current_user()['id'], playlists)

        playlist_titles_and_ids = list(map(
            lambda playlist: {'id': playlist['id'], 'title': playlist['name']}, filtered_playlists))

        return playlist_titles_and_ids

    @staticmethod
    def user_profile_data():

        token = request.args.get('token')
        if token is None:
            raise NoTokenError

        sp = spotipy.Spotify(auth=token)
        profile_data = sp.current_user()

        existing_user = db.session.query(User).filter(
            User.spotify_id == profile_data['id']).one_or_none()

        if existing_user is None:
            _create_user(profile_data)

        system_user = db.session.query(User).filter(
            User.spotify_id == profile_data['id']).one_or_none()

        profile_data['system_id'] = system_user.id

        return profile_data


# private helper functions
def _create_user(profile_data):
    '''
    Creates a User entry in the DB
    '''
    new_user = User(spotify_id=profile_data['id'])

    try:
        db.session.add(new_user)
        db.session.commit()
    except SQLAlchemyError:
        raise ServerError
