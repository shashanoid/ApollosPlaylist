import json
import requests
import spotipy
import random
from flask import request


from db import db
from users.user import User
from helpers.error import NoTokenError, NoUserError
from tracks.track_attribute import TrackAttributes, TrackAttribute
from playlists.playlist_creation_helper import aggregate_top_artists, aggregate_top_tracks, select_tracks


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # The spotify id of the Playlist, so we can get of the playlist data over and over
    spotify_id = db.Column(db.String(255), unique=False)

    # The user.id of the person who brought this playlist onto the system
    playlist_system_owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False)

    # The spotify owner of the playlist
    playlist_spotify_owner_id = db.Column(db.String(255), unique=False)

    @staticmethod
    def user_personal_playlists():
        token = request.args.get('token')

        if token is None:
            raise NoTokenError

        limit = request.args.get('limit')
        offset = request.args.get('offset')

        sp = spotipy.Spotify(auth=token)

        # Get the user data so we can check if we've loaded these playlists before
        spotify_user = sp.current_user()
        spotify_user_id = spotify_user['id']

        system_user = db.session.query(User).filter(
            User.spotify_id == spotify_user_id).one_or_none()

        # Query the playlist ids that the user has brought on to the system.
        user_system_playlists = list(db.session.query(Playlist))
        added_to_database = False

        results = sp.current_user_playlists(limit=limit, offset=offset)
        playlists = []

        for playlist in results['items']:
            spotify_id = playlist['id']
            images = playlist['images']
            title = playlist['name']
            author = sp.user(playlist['owner']['id'])['display_name']
            owner_spotify_id = playlist['owner']['id']

            result = any(
                spotify_id == system_playlist.spotify_id for system_playlist in user_system_playlists)

            if result is False:
                new_playlist = Playlist(
                    spotify_id=spotify_id, playlist_system_owner_id=system_user.id,
                    playlist_spotify_owner_id=owner_spotify_id)

                db.session.add(new_playlist)
                added_to_database = True

            playlists.append({
                'id': spotify_id,
                'images': images,
                'title': title,
                'author': author,
                'author_spotify_id': owner_spotify_id
            })

        if added_to_database is True:
            db.session.commit()

        return {'playlists': playlists, 'total': results['total']}

    @staticmethod
    def playlist_details():
        token = request.args.get('token')

        if token is None:
            raise NoTokenError

        playlist_spotify_id = request.args.get('playlistSpotifyId')
        playlist_owner_id = request.args.get('userSpotifyId')

        sp = spotipy.Spotify(auth=token)

        playlist = sp.user_playlist(
            playlist_owner_id, playlist_id=playlist_spotify_id)

        playlist_tracks = []

        all_tracks = True
        offset = 0

        if playlist['tracks']['next'] is not None:
            all_tracks = False

        playlist_tracks += playlist['tracks']['items']

        while(not all_tracks):
            more_tracks = sp.user_playlist_tracks(
                playlist_owner_id, playlist_id=playlist_spotify_id, offset=offset + 100)
            playlist_tracks += more_tracks['items']
            offset = more_tracks['offset']

            if more_tracks['next'] is None:
                all_tracks = True

        tracks = []

        for playlist_track in playlist_tracks:
            track = playlist_track['track']
            track_artists = []

            for artist in track['artists']:
                track_artists.append(
                    {'name': artist['name'], 'id': artist['id']})

            tracks.append({
                'added_at': playlist_track['added_at'],
                'title': track['name'],
                'id': track['id'],
                'duration_ms': track['duration_ms'],
                'explicit': track['explicit'],
                'popularity': track['popularity'],
                'preview_url': track['preview_url'],
                'artists': track_artists,
                'spotify_url': track['external_urls']['spotify'],
                'album': {
                    'title': track['album']['name'],
                    'id': track['album']['id'],
                    'images': track['album']['images']
                }
            })

        return {
            'playlist_spotify_id': playlist['id'],
            'description': playlist['description'],
            'followers': playlist['followers']['total'],
            'collaborative': playlist['collaborative'],
            'public': playlist['public'],
            'images': playlist['images'],
            'title': playlist['name'],
            'author': playlist['owner']['display_name'],
            'owner_spotify_id': playlist['owner']['id'],
            'spotify_url': playlist['external_urls']['spotify'],
            'tracks': tracks
        }

    @staticmethod
    def playlist_statistics():
        token = request.args.get('token')

        # wow look at python null checks omg they're literally written in english
        if token is None:
            raise NoTokenError

        playlist_spotify_id = request.args.get('playlistSpotifyId')
        playlist_owner_id = request.args.get('userSpotifyId')

        sp = spotipy.Spotify(auth=token)

        tracks = sp.user_playlist_tracks(
            playlist_owner_id, playlist_id=playlist_spotify_id)

        all_tracks = True
        offset = 0

        if tracks['next'] is not None:
            all_tracks = False

        playlist_tracks = []
        audio_features = sp.audio_features(
            map(lambda track: track['track']['id'] or "", tracks['items']))
        playlist_tracks += tracks['items']

        while(not all_tracks):
            more_tracks = sp.user_playlist_tracks(
                playlist_owner_id, playlist_id=playlist_spotify_id, offset=offset + 100)
            audio_features += sp.audio_features(
                map(lambda track: track['track']['id'] or "", more_tracks['items']))
            playlist_tracks += more_tracks['items']
            offset = more_tracks['offset']

            if more_tracks['next'] is None:
                all_tracks = True

        stats_acc = {
            'acousticness': 0,
            'danceability': 0,
            'energy': 0,
            'instrumentalness': 0,
            'liveness': 0,
            'loudness': 0,
            'speechiness': 0,
            'valence': 0,
            'tempo': 0
        }

        for audio_feature in audio_features:
            if audio_feature is not None:
                stats_acc['acousticness'] += audio_feature['acousticness']
                stats_acc['danceability'] += audio_feature['danceability']
                stats_acc['energy'] += audio_feature['energy']
                stats_acc['instrumentalness'] += audio_feature['instrumentalness']
                stats_acc['liveness'] += audio_feature['liveness']
                stats_acc['loudness'] += audio_feature['loudness']
                stats_acc['speechiness'] += audio_feature['speechiness']
                stats_acc['valence'] += audio_feature['valence']
                stats_acc['tempo'] += audio_feature['tempo']

        num_of_features = len(audio_features)

        playlist_stats = TrackAttributes(
            TrackAttribute(0.0, 1.0, round(
                stats_acc['acousticness'] / num_of_features, 4)),  # acoustincness
            TrackAttribute(0.0, 1.0, round(
                stats_acc['danceability'] / num_of_features, 4)),  # danceability
            TrackAttribute(0.0, 1.0, round(
                stats_acc['energy'] / num_of_features, 4)),  # energy
            TrackAttribute(0.0, 1.0, round(
                stats_acc['instrumentalness'] / num_of_features, 4)),  # instrumentalness
            TrackAttribute(0.0, 1.0, round(
                stats_acc['liveness'] / num_of_features, 4)),  # liveness
            # loudness
            TrackAttribute(-50.0, 5.0,
                           round(stats_acc['loudness'] / num_of_features, 4)),
            TrackAttribute(0.0, 1.0, round(
                stats_acc['speechiness'] / num_of_features, 4)),  # speechiness
            TrackAttribute(0.0, 250.0, round(
                stats_acc['tempo'] / num_of_features, 4)),  # tempo
            TrackAttribute(0.0, 1.0, round(stats_acc['valence'] / num_of_features, 4)))  # valence

        return playlist_stats.toJSON()

    @staticmethod
    def add_tracks_to_playlist():
        request_json = request.get_json()

        token = request_json.get('token')

        if token is None:
            raise NoTokenError

        playlist_owner_id = request_json.get('userSpotifyId')
        playlist_spotify_id = request_json.get('playlistSpotifyId')
        tracks = request_json.get('trackIds')

        sp = spotipy.Spotify(auth=token)

        return sp.user_playlist_add_tracks(playlist_owner_id, playlist_spotify_id, tracks)

    @staticmethod
    def user_playlist_unfollow():
        request_json = request.get_json()

        token = request_json.get('token')

        if token is None:
            raise NoTokenError

        playlist_owner_id = request_json.get('userSpotifyId')
        playlist_spotify_id = request_json.get('playlistSpotifyId')

        sp = spotipy.Spotify(auth=token)

        return sp.user_playlist_unfollow(playlist_owner_id, playlist_spotify_id)

    @staticmethod
    def user_playlist_follow_playlist():
        token = request.args.get('token')

        if token is None:
            raise NoTokenError

        playlist_owner_id = request.args.get('userSpotifyId')
        playlist_spotify_id = request.args.get('playlistSpotifyId')

        sp = spotipy.Spotify(auth=token)

        return sp.user_playlist_follow_playlist(playlist_owner_id, playlist_spotify_id)

    @staticmethod
    def get_tracks_from_attributes():
        token = request.args.get('token')

        if token is None:
            raise NoTokenError

        sp = spotipy.Spotify(auth=token)

        # Get a User’s Top Artists and Tracks
        top_artists_uri = aggregate_top_artists(sp)

        # Get top tracks for the artists returned above
        top_tracks_uri = aggregate_top_tracks(sp, top_artists_uri)

        energy = float(request.args.get('energy'))
        danceability = float(request.args.get('danceability'))
        acousticness = float(request.args.get('acousticness'))
        tempo_low = request.args.get('tempoLow')
        tempo_high = request.args.get('tempoHigh')

        tempo = [int(tempo_low), int(tempo_high)]

        track_uris = select_tracks(sp, top_tracks_uri, energy, danceability, acousticness, tempo)

        return list(map((lambda track: sp.track(track)), track_uris))

    @staticmethod
    def create_user_playlist_with_tracks():
        request_json = json.loads(request.json['data'])

        token = request_json['token']

        if token is None:
            raise NoTokenError

        sp = spotipy.Spotify(auth=token)

        playlist_owner_id = request_json['userSpotifyId']
        playlist_name = request_json['playlistName']

        # creating a new playlist for the mood
        sp.user_playlist_create(playlist_owner_id, playlist_name, public=True)

        # since the spotfiy API doesn't return anything when using the 'user_playlist_create'
        # function, we have to go through the list of playlists assigned to the user and get
        # the newly created playlist
        playlist_spotify_id = sp.current_user_playlists()['items'][0]['uri']

        tracks = request_json['tracks']

        track_uris = list(map((lambda track: track['uri']), tracks))

        return sp.user_playlist_add_tracks(playlist_owner_id, playlist_spotify_id, track_uris)
