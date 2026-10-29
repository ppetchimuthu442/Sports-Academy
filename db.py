import mysql.connector
from mysql.connector import Error


def get_connection():
    """
    Create and return a MySQL/MariaDB database connection
    for the Sports Academy project.
    """

    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="sports academy",
            port=3306,
            charset="utf8mb4",
            collation="utf8mb4_unicode_ci",
            autocommit=False
        )

        return connection

    except Error as e:
        print("Database connection error:", e)
        raise