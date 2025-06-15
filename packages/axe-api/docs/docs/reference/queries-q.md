# `q` (Query)

You can use almost everything on any database server. Also, it supports recursive conditions.

## Simple Condition

```
/api/v1/users?q={ "id": 1 }
```

```sql
WHERE `id` = 1
```

## Multiple Conditions

```
/api/v1/users?q=[ {"name": "John"}, {"surname": "Locke" } ]
```

```sql
WHERE `name` = 'John' AND `surname` = 'Locke'
```

## Logical Expressions

```
/api/v1/users?q=[ {"name": "John"}, {"$or.surname": "Locke" } ]
```

```sql
WHERE `name` = 'John' OR `surname` = 'Locke'
```

> Also, you can use the `$and` prefix. If you don't specify any prefix, \$and will be used as default.

## Recursive Conditions

```
/api/v1/users?q=[
   [{"name": "John"}, {"$or.surname": "Locke" }],
   [{"$or.age": 18}, {"$or.id": 666 }]
  ]
```

```sql
WHERE
  (
    `name` = 'John' OR `surname` = 'Locke'
  )
  OR (
    `age` = 18 OR `id` = 666
  )
```

## Parent Conditions

If there is a one-to-one relationship between the parent record, you can filter the child's data by parent's fields.

Let's assume that you have a relationship like this;

```ts
class Student extends Model {
  school(): IRelation {
    return this.hasOne("School", "id", "school_id");
  }
}

class School extends Model {}
```

In this scenario, the client is able to query the student by the school's names;

```
/api/v1/students?q=[ {"school.name.$like": "*Institution*"} ]
```

:::warning
Clients should use the relationship definition title (`school` in this example) in the query.
:::

The SQL equivalent will be like this;

```sql
SELECT students.*
FROM students
LEFT JOIN schools ON schools.id = students.school_id
WHERE schools.name LIKE "%Institution%";
```

:::warning
You can use these kinds of queries for only a **one-to-one** relationship. For example, you **can't** filter schools by student names.
:::

## Operators

You may use the following operators in all of your queries by adding the operator to the end of your field name.

| Operator      | Request `/api/v1/users?q=`    | SQL (MySQL)              |
| ------------- | ----------------------------- | ------------------------ |
| `$not`        | `{"id.$not": 10}`             | `id <> 10`               |
| `$gt`         | `{"id.$gt": 10}`              | `id > 10`                |
| `$gte`        | `{"id.$gte": 10}`             | `id >= 10`               |
| `$lt`         | `{"id.$lt": 10}`              | `id < 10`                |
| `$lte`        | `{"id.$lte": 10}`             | `id <= 10`               |
| `$like`       | `{"name.$like": "Foo*"}`      | `name LIKE 'Foo%'`       |
| `$notLike`    | `{"name.$notLike": "*Foo*"}`  | `name NOT LIKE '%Foo%'`  |
| `$in`         | `{"id.$in": [1,2]}`           | `id IN (1, 2)`           |
| `$notIn`      | `{"id.$notIn": [1,2]}`        | `id NOT IN (1,2 )`       |
| `$between`    | `{"id.$between": [1, 10]}`    | `id BETWEEN (1, 10)`     |
| `$notBetween` | `{"id.$notBetween": [1, 10]}` | `id NOT BETWEEN (1, 10)` |
|               | `{"id": null}`                | `id IS NULL`             |
| `$not`        | `{"id.$not": null}`           | `id IS NOT NULL`         |
