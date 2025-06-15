#!/bin/bash
set -e

DB_PROVIDER=$1
SLEEP=$2

if [[ -z "$DB_PROVIDER" ]]; then
  echo "❌ Please provide a database client (e.g. sqlite, mysql, postgres)."
  exit 1
fi

case "$DB_PROVIDER" in
  mysql8) DB_CLIENT="mysql2" ;;
  mysql57) DB_CLIENT="mysql" ;;
  postgres11|postgres12|postgres13|postgres14|postgres15) DB_CLIENT="postgres" ;;
  cockroach) DB_CLIENT="cockroachdb" ;;
  mariadb) DB_CLIENT="mysql" ;;
  sqlite) DB_CLIENT="sqlite3" ;;
  *)
    echo "❌ Unsupported DB_PROVIDER: $DB_PROVIDER"
    exit 1
    ;;
esac

# Build Docker Compose file path dynamically
COMPOSE_FILE="./composes/docker-compose.${DB_PROVIDER}.yml"
KNEX_CONFIG="./knex/${DB_CLIENT}.config.js"

echo "✅ DB_PROVIDER=$DB_PROVIDER"
echo "✅ DB_CLIENT=$DB_CLIENT"
echo "✅ COMPOSE_FILE=$COMPOSE_FILE"
echo "✅ KNEX_CONFIG=$KNEX_CONFIG"

export DB_PROVIDER=$DB_PROVIDER
export DB_CLIENT=$DB_CLIENT

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌ Compose file not found: $COMPOSE_FILE"
  exit 1
fi

echo "🧹 Shutting down any previous containers"
docker compose -f "$COMPOSE_FILE" down

echo "🐳 Starting Docker containers for $DB_PROVIDER"
docker compose -f "$COMPOSE_FILE" up -d --build


echo "📦 Installing dependencies"
npm install

echo "⏳ Waiting for DB to initialize ${SLEEP}"
sleep $SLEEP

echo "🧨 Running migrations"
echo "Using knexfile: knex/${DB_CLIENT}.config.js"
if [[ ! -f "knex/${DB_CLIENT}.config.js" ]]; then
  echo "❌ Knex configuration file not found: knex/${DB_CLIENT}.config.js"
  exit 1
fi

# Remove existing database file if using SQLite
rm -rf ./axedb.sql

# Run migrations using the specified knex configuration
knex migrate:latest --knexfile $KNEX_CONFIG


echo "🚀 Starting application"
npm run dev & SERVER_PID=$!

echo "🌐 Waiting for server to be ready..."
until curl -s http://localhost:3000/docs > /dev/null; do
  sleep 1
done

echo "🧪 Running tests..."
npm run test

echo "🧹 Shutting down any previous containers"
docker compose -f "$COMPOSE_FILE" down
