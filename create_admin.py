from werkzeug.security import generate_password_hash
from db import get_connection


print("=" * 50)
print("       SPORTS ACADEMY ADMIN CREATOR")
print("=" * 50)

username = input("Enter admin username [admin]: ").strip()

if not username:
    username = "admin"

password = input("Enter admin password: ").strip()

if not password:
    print("Password cannot be empty.")
    exit()

password_hash = generate_password_hash(password)

connection = None
cursor = None

try:
    connection = get_connection()
    cursor = connection.cursor()

    sql = """
        INSERT INTO admin_users
        (username, password_hash)
        VALUES (%s, %s)
    """

    cursor.execute(sql, (username, password_hash))

    connection.commit()

    print()
    print("========================================")
    print("ADMIN CREATED SUCCESSFULLY")
    print("========================================")
    print("Username :", username)
    print("Password : Your entered password")
    print("========================================")

except Exception as e:

    if connection:
        connection.rollback()

    print()
    print("ERROR:", e)

finally:

    if cursor:
        cursor.close()

    if connection:
        connection.close()