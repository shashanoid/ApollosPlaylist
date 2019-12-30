class NoTokenError(Exception):
    def __init__(self):
        self.http_status = 401
        self.message = "No token provided"


class NoUserError(Exception):
    def __init__(self):
        self.http_status = 401
        self.message = "No user found!"


class ServerError(Exception):
    def __init__(self):
        self.http_status = 500
        self.message = "Oh no! There seems to be an error on our end!"
