import json
from json import dumps
from flask import make_response, abort, jsonify


def endpoint_response(res):
    return make_response(json.dumps(res))


def error_endpoint_response(error):
    '''
        Error response creation, all errors leaving the server should now have an http_status, along with a message,
        ever server call in the front end should now catch any errors that might happen
    '''
    # if it is a custom error that we are throwing, then use the attributes we populate
    if hasattr(error, 'msg') and hasattr(error, 'http_status'):
        return abort(make_response(jsonify(message=error.message), error.http_status))

    # if it isn't one of our errors, we need to throw a generic error
    return abort(make_response(jsonify(message="Oh no! There seems to be an error on our end!"), 500))
