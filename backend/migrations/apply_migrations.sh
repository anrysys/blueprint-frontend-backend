#!/bin/sh

# Применение миграций
for migration in /app/migrations/*.sql; do
  echo "Applying migration: $migration"
  PGPASSWORD=password psql -h db -U postgres -d mydb -f "$migration"
done