# `trashed`

You can use the `trashed` parameters to list soft-deleted records if the [Soft Delete](/reference/model-deleted-at-column) feature is enabled.

```js
/api/v1/customers?trashed=true
```

```json
{
  "data": [
    {
      "id": 4,
      "name": "Customer 1",
      "created_at": "2023-01-01T16:22:17.000Z",
      "updated_at": "2023-01-10T16:22:17.000Z",
      "deleted_at": "2023-01-29T16:22:50.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 1
  }
}
```

You can see in the JSON that the record has been marked as deleted by looking at `deleted_at` value. You can not see this record if you don't use `trashed` keyword.
