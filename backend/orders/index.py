import json
import os
import psycopg2

SCHEMA = "t_p47486170_factory_shop_web"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

def row_to_dict(row):
    return {
        "id": row[0],
        "clientId": row[1],
        "date": str(row[2]),
        "status": row[3],
        "amount": float(row[4])
    }

def handler(event: dict, context) -> dict:
    """CRUD заказов."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod")
    path = event.get("path", "")
    body = json.loads(event.get("body") or "{}")

    parts = [p for p in path.split("/") if p]
    record_id = None
    if parts and parts[-1].isdigit():
        record_id = int(parts[-1])

    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        cur.execute(f"SELECT id, client_id, date, status, amount FROM {SCHEMA}.orders ORDER BY id DESC")
        rows = cur.fetchall()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps([row_to_dict(r) for r in rows])}

    if method == "POST":
        cur.execute(
            f"INSERT INTO {SCHEMA}.orders (client_id, date, status, amount) VALUES (%s, %s, %s, %s) RETURNING id, client_id, date, status, amount",
            (body.get("clientId"), body.get("date"), body.get("status", "new"), body.get("amount", 0))
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(row_to_dict(row))}

    if method == "PUT" and record_id:
        cur.execute(
            f"UPDATE {SCHEMA}.orders SET client_id=%s, date=%s, status=%s, amount=%s WHERE id=%s RETURNING id, client_id, date, status, amount",
            (body.get("clientId"), body.get("date"), body.get("status"), body.get("amount"), record_id)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if row:
            return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(row_to_dict(row))}
        return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}

    if method == "DELETE" and record_id:
        cur.execute(f"DELETE FROM {SCHEMA}.orders WHERE id = %s", (record_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}
