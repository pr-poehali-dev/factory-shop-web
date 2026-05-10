import json
import os
import psycopg2

SCHEMA = "t_p47486170_factory_shop_web"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

def handler(event: dict, context) -> dict:
    """Авторизация и регистрация. action=login|register в теле запроса."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "login")

    conn = get_conn()
    cur = conn.cursor()

    if action == "login":
        login = body.get("login", "").strip()
        password = body.get("password", "")
        cur.execute(
            f"SELECT id, login, name, role FROM {SCHEMA}.users WHERE login = %s AND password = %s",
            (login, password)
        )
        row = cur.fetchone()
        conn.close()
        if row:
            return {
                "statusCode": 200,
                "headers": cors_headers(),
                "body": json.dumps({"ok": True, "user": {"id": row[0], "login": row[1], "name": row[2], "role": row[3]}})
            }
        return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"ok": False, "error": "Неверный логин или пароль"})}

    if action == "register":
        login = body.get("login", "").strip()
        password = body.get("password", "")
        name = body.get("name", "").strip()
        if not login or not password or not name:
            conn.close()
            return {"statusCode": 400, "headers": cors_headers(), "body": json.dumps({"ok": False, "error": "Заполните все поля"})}
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE login = %s", (login,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": cors_headers(), "body": json.dumps({"ok": False, "error": "Такой логин уже занят"})}
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (login, password, name, role) VALUES (%s, %s, %s, 'user') RETURNING id",
            (login, password, name)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps({"ok": True, "user": {"id": user_id, "login": login, "name": name, "role": "user"}})
        }

    conn.close()
    return {"statusCode": 400, "headers": cors_headers(), "body": json.dumps({"error": "Unknown action"})}