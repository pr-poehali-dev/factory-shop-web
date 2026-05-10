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
    return {"id": row[0], "name": row[1], "article": row[2], "category": row[3], "price": float(row[4]), "stock": row[5]}

def handler(event: dict, context) -> dict:
    """CRUD товаров."""
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
        cur.execute(f"SELECT id, name, article, category, price, stock FROM {SCHEMA}.products ORDER BY id")
        rows = cur.fetchall()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps([row_to_dict(r) for r in rows])}

    if method == "POST":
        cur.execute(
            f"INSERT INTO {SCHEMA}.products (name, article, category, price, stock) VALUES (%s, %s, %s, %s, %s) RETURNING id, name, article, category, price, stock",
            (body.get("name"), body.get("article"), body.get("category"), body.get("price", 0), body.get("stock", 0))
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(row_to_dict(row))}

    if method == "PUT" and record_id:
        cur.execute(
            f"UPDATE {SCHEMA}.products SET name=%s, article=%s, category=%s, price=%s, stock=%s WHERE id=%s RETURNING id, name, article, category, price, stock",
            (body.get("name"), body.get("article"), body.get("category"), body.get("price", 0), body.get("stock", 0), record_id)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if row:
            return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(row_to_dict(row))}
        return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}

    if method == "DELETE" and record_id:
        cur.execute(f"DELETE FROM {SCHEMA}.products WHERE id = %s", (record_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"})}
