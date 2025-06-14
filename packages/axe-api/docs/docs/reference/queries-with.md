# `with`

You can fetch the related data for the `PAGINATION` and the `SHOW` handlers.

```bash
GET /api/v1/users?with=posts{comments{id|content}}
```

`HTTP Response`

```json
{
  "id": 1,
  "email": "user@mail.com",
  "posts": [
    {
      "id": 1,
      "user_id": 1,
      "title": "The first blog post",
      "comments": [
        {
          "id": 1,
          "post_id": 1,
          "content": "The content of the comment."
        }
      ]
    }
  ]
}
```

You can use relation names recursively like this; `posts{comments{likes}}`.

But also, you can select which columns will be fetched for the relation. You don't have to fetch all columns.

```bash
GET /api/v1/users?with=posts{id|title}}
```

> Foreign and Primary Key columns will be returned automatically.
