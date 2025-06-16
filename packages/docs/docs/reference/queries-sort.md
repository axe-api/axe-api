# `sort`

You may sort your results by your selections for multiple columns;

```bash
GET /api/v1/users?sort=surname,-name
```

This request is equal on SQL;

```sql
ORDER BY `surname` ASC, `name` DESC
```

In this request, `-` means `DESC`.
