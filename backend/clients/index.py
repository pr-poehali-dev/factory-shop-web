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
    return {"id": row[0], "company": row[1], "contact": row[2], "phone": row[3], "email": row[4]}

def handler(event: dict, context) -> dict:
    """CRUD клиентов."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod")
    path = event.get("path", "")
    body = json.loads(event.get("body") or "{}")

    # Extract id from path like /123
    parts = [p for p in path.split("/") if p]
    record_id = None
    if parts and parts[-1].isdigit():
        record_id = int(parts[-1])

    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        cur.execute(f"SELECT id, company, contact, phone, email FROM {SCHEMA}.clients ORDER BY id")
        rows = cur.fetchall()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps([row_to_dict(r) for r in rows])}

    if method == "POST":
        cur.execute(
            f"INSERT INTO {SCHEMA}.clients (company, contact, phone, email) VALUES (%s, %s, %s, %s) RETURNING id, company, contact, phone, email",
            (body.get("company"), body.get("contact"), body.get("phone"), body.get("email"))
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(row_to_dict(row))}

    if method == "PUT" and record_id:
        cur.execute(
            f"UPDATE {SCHEMA}.clients SET company=%s, contact=%s, phone=%s, email=%s WHERE id=%s RETURNING id, company, contact, phone, email",
            (body.get("company"), body.get("contact"), body.get("phone"), body.get("email"), record_id)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if row:
            return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(row_to_dict(row))}
        return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}

    if method == "DELETE" and record_id:
        cur.execute(f"UPDATE {SCHEMA}.orders SET client_id = NULL WHERE client_id = %s", (record_id,))
        cur.execute(f"DELETE FROM {SCHEMA}.clients WHERE id = %s", (record_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}
