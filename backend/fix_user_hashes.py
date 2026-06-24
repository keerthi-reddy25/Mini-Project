import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='Gowthu@18',
    database='appointment_db'
)
cur = conn.cursor()
cur.execute("UPDATE users SET password = %s WHERE email = %s", (
    '$2b$12$6viOe0N8DZfyAzrgFxb2yeTj636/r8874GAS1dsarCaM0PLLWqWum',
    'admin@bookapp.com'
))
cur.execute("UPDATE users SET password = %s WHERE email = %s", (
    '$2b$12$aYKdOy/pYgFZrgo45q1omOoHokMLwV.gMnh3ibG04aZijUJvErYCu',
    'user@bookapp.com'
))
conn.commit()
cur.close()
conn.close()
print('Updated admin and user password hashes successfully.')
