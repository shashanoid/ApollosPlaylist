from flask import Blueprint


from helpers.error import NoTokenError
from helpers.response import endpoint_response, error_endpoint_response
from playlists.playlist import Playlist

playlists_handler = Blueprint('playlists', 'playlists', url_prefix='/playlists')


@playlists_handler.route('/personal-playlists', methods=["GET"])
def user_personal_playlists():
    '''
        Get current user playlists without requred getting their profile
    '''
    try:
        return endpoint_response(Playlist.user_personal_playlists())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/playlist', methods=["GET"])
def playlist_details():
    '''
        Get playlist details of a user
    '''
    try:
        return endpoint_response(Playlist.playlist_details())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/playlist-stats', methods=["GET"])
def playlist_statistics():
    '''
        Get full details of the tracks of a playlist owned by a user
    '''
    try:
        return endpoint_response(Playlist.playlist_statistics())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/add-tracks', methods=["POST"])
def add_tracks_to_playlist():
    '''
        Adds a track to an existing playlist
    '''
    try:
        return endpoint_response(Playlist.add_tracks_to_playlist())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/unfollow-playlist', methods=["DELETE"])
def user_playlist_unfollow():
    '''
        Unfollows a playlist for a user
    '''
    try:
        return endpoint_response(Playlist.user_playlist_unfollow())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/follow-playlist', methods=["GET"])
def user_playlist_follow_playlist():
    '''
        Add the current authenticated user as a follower of a playlist
    '''
    try:
        return endpoint_response(Playlist.user_playlist_follow_playlist())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/get-tracks-from-attributes', methods=["GET"])
def get_tracks_from_attributes():
    '''
        Gets track URIs for tracks that match the attributes
    '''
    try:
        return endpoint_response(Playlist.get_tracks_from_attributes())
    except Exception as e:
        return error_endpoint_response(e)


@playlists_handler.route('/create-playlist-with-tracks', methods=["GET"])
def create_user_playlist_with_tracks():
    '''
        Creates a playlist with the given tracks
    '''
    try:
        return endpoint_response(Playlist.create_user_playlist_with_tracks())
    except Exception as e:
        return error_endpoint_response(e)
