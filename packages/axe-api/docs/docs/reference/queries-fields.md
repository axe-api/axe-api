# `fields`

To get only specific fields, you may use a query like the following statement;

```bash
GET /api/v1/users?fields:id,name,surname
```

This request is equal on SQL;

```sql
SELECT `id`, `name`, `surname`
```
