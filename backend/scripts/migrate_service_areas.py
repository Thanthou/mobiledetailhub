"""
migrate_service_areas.py

Reads all businesses (slug, service_areas) from the businesses table, and for each service area (city, state, zip), upserts into the service_areas table, appending the business slug to business_slugs if not already present.

Usage:
  python migrate_service_areas.py

Environment variables required:
  PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
"""
import os
import psycopg2
import json

def get_connection():
    return psycopg2.connect(
        host=os.environ.get('PGHOST', 'localhost'),
        user=os.environ.get('PGUSER', 'postgres'),
        password='B95c1143!',
        dbname='MobileDetailHub',
        port=os.environ.get('PGPORT', 5432)
    )

def migrate_service_areas():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT slug, service_areas FROM businesses")
        businesses = cur.fetchall()
        for slug, service_areas in businesses:
            if not service_areas:
                continue
            for area in service_areas:
                city = area.get('city')
                state = area.get('state')
                zip_code = str(area.get('zip')) if area.get('zip') is not None else None
                if not city or not state:
                    continue
                # Upsert: insert or append slug if not present
                cur.execute("""
                    INSERT INTO service_areas (city, state, zip, business_slugs)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (city, state, zip)
                    DO UPDATE SET business_slugs = (
                        SELECT CASE
                            WHEN NOT service_areas.business_slugs @> %s::jsonb
                            THEN service_areas.business_slugs || %s::jsonb
                            ELSE service_areas.business_slugs
                        END
                    )
                """, (
                    city, state, zip_code, json.dumps([slug]),
                    json.dumps([slug]), json.dumps([slug])
                ))
                print(f"Upserted {city}, {state} {zip_code} with slug '{slug}'")
        conn.commit()
    finally:
        cur.close()
        conn.close()

def main():
    migrate_service_areas()

if __name__ == '__main__':
    main()
