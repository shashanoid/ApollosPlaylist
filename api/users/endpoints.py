from flask import Blueprint, abort


from helpers.error import NoTokenError
from helpers.response import endpoint_response, error_endpoint_response
from users.user import User

user_handler = Blueprint('users', 'users', url_prefix='/users')


@user_handler.route('/top_tracks', methods=["GET"])
def current_user_top_tracks():
    '''
        Get the current user's top tracks
    '''
    try:
        return endpoint_response(User.current_user_top_tracks())
    except Exception as e:
        return error_endpoint_response(e)


@user_handler.route('/editable-playlists', methods=["GET"])
def current_user_playlists():
    '''
        Get current user playlists without getting their profile parameters
    '''
    try:
        return endpoint_response(User.current_user_playlists())
    except Exception as e:
        return error_endpoint_response(e)


@user_handler.route('/user', methods=["GET"])
def user_profile_data():
    '''
        Get details profile information about the current user. If this is the user's first
        time logging onto our system, create a User entry with their spotify ID
    '''
    try:
        return endpoint_response(User.user_profile_data())
    except Exception as e:
        return error_endpoint_response(e)
