import pymysql.cursors
from flask_sqlalchemy import SQLAlchemy
from flask import Flask


mysql_host = "localhost"
mysql_port = 3306
mysql_user = "root"
mysql_password = ""
mysql_db_name = ""


db = SQLAlchemy()


def init_database(app=None):
    """Initializes the global database object used by the app."""
    if isinstance(app, Flask) and isinstance(db, SQLAlchemy):

        app.config["SQLALCHEMY_DATABASE_URI"] = (
            f"mysql+pymysql://{mysql_user}:"
            f"{mysql_password}@{mysql_host}:"
            f"{mysql_port}/{mysql_db_name}"
        )

        db.init_app(app)
        return db
    else:
        raise ValueError('Cannot init DB without db and app objects.')


# Connect to the database
connection = pymysql.connect(host=mysql_host,
                             user=mysql_user,
                             password=mysql_password,
                             db=mysql_db_name,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


# To be used in prod
def commit(query):
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            connection.commit()
    finally:
        connection.close()
