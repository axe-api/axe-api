import QueryParser from "./../../../src/core/QueryParser";
const options = {
  min_per_page: 10,
  max_per_page: 100,
};

const model = {
  instance: {
    table: "users",
    relations: [
      {
        name: "users",
      },
    ],
  },
};

const testParser = (parser, expression, field, condition, value) => {
  const result = parser._parseCondition(expression);
  expect(result.field).toBe(field);
  expect(result.condition).toBe(condition);
  expect(result.value).toBe(value);
};

test("I should be able to override basic options", () => {
  expect(new QueryParser({ model }).options.max_per_page).toBe(1000);
  expect(
    new QueryParser({ options: { max_per_page: 25 } }).options.max_per_page
  ).toBe(25);
});

test("I should be able to see an error when I try to set unacceptable options", () => {
  let parser = null;
  /* eslint-disable no-new */
  expect(() => {
    parser = new QueryParser({ options: { min_per_page: -10 } });
  }).toThrow(Error);
  expect(() => {
    parser = new QueryParser({ options: { max_per_page: 100000 } });
  }).toThrow(Error);
  expect(() => {
    parser = new QueryParser({ options: { min_per_page: "xxx" } });
  }).toThrow(Error);
  expect(() => {
    parser = new QueryParser({ options: { max_per_page: "xxx" } });
  }).toThrow(Error);
  expect(parser).toBe(null);
});

test("I should be able to get an error when I send unacceptable query string", () => {
  const parser = new QueryParser({ model });
  expect(() => {
    parser._getSections(null);
  }).toThrow(Error);
  expect(() => {
    parser._getSections(1231);
  }).toThrow(Error);
  expect(() => {
    parser._getSections(1231.12);
  }).toThrow(Error);
  expect(() => {
    parser._getSections("asdad");
  }).toThrow(Error);
});

test("I should be able to split queries to different sections", () => {
  const parser = new QueryParser({ model });
  const query = {
    q: '{"salary": {"$gt": 10000}}',
    page: "1",
    per_page: "25",
    sort: "-id",
    fields: "id,name,surname",
    with: "posts",
  };
  const result = parser._getSections(query);
  expect(result.q).not.toBe(null);
  expect(result.sort).not.toBe(null);
  expect(result.fields).not.toBe(null);
  expect(result.with).not.toBe(null);
  expect(result.page).not.toBe(null);
  expect(result.per_page).not.toBe(null);
});

test("I should be able to split queries when I don`t send full sections", () => {
  const parser = new QueryParser({ model });
  const result = parser._getSections({});

  expect(result.q).toBe(null);
  expect(result.sort).toBe(null);
  expect(result.fields).toBe(null);
  expect(result.with).toBe(null);
  expect(result.page).toBe(null);
  expect(result.per_page).toBe(null);
});

test("I should be able to split queries when I don`t send partly sections", () => {
  const parser = new QueryParser({ model });
  const query = {
    page: "1",
    fields: "id,name,surname",
  };
  const result = parser._getSections(query);

  expect(result.q).toBe(null);
  expect(result.sort).toBe(null);
  expect(result.fields).not.toBe(null);
  expect(result.with).toBe(null);
  expect(result.page).not.toBe(null);
  expect(result.per_page).toBe(null);
});

test("I should be able to parse the page parameter", () => {
  const parser = new QueryParser({ model });
  expect(parser._parsePage("1")).toBe(1);
  expect(parser._parsePage("12")).toBe(12);
  expect(parser._parsePage("123")).toBe(123);
  expect(parser._parsePage("ass")).toBe(1);
  expect(parser._parsePage("-12")).toBe(1);
  expect(parser._parsePage(16)).toBe(16);
  expect(parser._parsePage(16.21)).toBe(16);
  expect(parser._parsePage("16.99")).toBe(16);
});

test("I should be able to parse the per_page parameter", () => {
  const parser = new QueryParser({ model, options });
  expect(parser._parsePerPage("10")).toBe(10);
  expect(parser._parsePerPage("12")).toBe(12);
  expect(parser._parsePerPage("as")).toBe(10);
  expect(parser._parsePerPage("5")).toBe(10);
  expect(parser._parsePerPage(100)).toBe(100);
  expect(parser._parsePerPage(110)).toBe(100);
});

test("I should be able to parse the fields", () => {
  const parser = new QueryParser({ model });
  let result = parser._parseFields("id,email");
  expect(result.length).toBe(2);
  expect(result[0]).toBe("id");
  expect(result[1]).toBe("email");

  result = parser._parseFields("id");
  expect(result.length).toBe(1);
  expect(result[0]).toBe("id");
});

test("I should be able to get an error while parsing unacceptable column name", () => {
  const parser = new QueryParser({ model });
  // Acceptable exceptions
  expect(parser._parseFields("full_name").length).toBe(1);
  expect(parser._parseFields("id,users.name").length).toBe(2);
  expect(parser._parseFields("*")).toBe("*");
  // Unacceptable error testing
  expect(() => {
    parser._parseFields("id,email|sample");
  }).toThrow(Error);
  expect(() => {
    parser._parseFields("id,email?sample");
  }).toThrow(Error);
  expect(() => {
    parser._parseFields("id,full-name");
  }).toThrow(Error);
});

test("I should be able to parsing sorting options", () => {
  const parser = new QueryParser({ model });
  const result = parser._parseSortingOptions("id,-name,+surname");
  expect(result.length).toBe(3);
  expect(result[0].field).toBe("id");
  expect(result[0].type).toBe("ASC");
  expect(result[1].field).toBe("name");
  expect(result[1].type).toBe("DESC");
  expect(result[2].field).toBe("surname");
  expect(result[2].type).toBe("ASC");
});

test("I should be able to get an error while parsing unacceptable column in sorting", () => {
  const parser = new QueryParser({ model });
  expect(parser._parseSortingOptions("id,full_name")[1].field).toBe(
    "full_name"
  );
  expect(() => {
    parser._parseSortingOptions("id,full-name");
  }).toThrow(Error);
  expect(() => {
    parser._parseSortingOptions("id,full+name");
  }).toThrow(Error);
});

test("I should be able to parsing query condition", () => {
  const parser = new QueryParser({ model });

  let result = null;

  testParser(parser, { name: "Özgür" }, "name", "=", "Özgür");
  testParser(parser, { "id.$not": 1 }, "id", "<>", 1);
  testParser(parser, { "id.$gt": 1 }, "id", ">", 1);
  testParser(parser, { "id.$gte": 1 }, "id", ">=", 1);
  testParser(parser, { "id.$lt": 1 }, "id", "<", 1);
  testParser(parser, { "id.$lte": 1 }, "id", "<=", 1);
  testParser(parser, { "name.$like": "John*" }, "name", "LIKE", "John%");
  testParser(parser, { "name.$notLike": "John*" }, "name", "NOT LIKE", "John%");

  // .$in logic tests
  result = parser._parseCondition({ "id.$in": "1,2,3" });
  expect(result.field).toBe("id");
  expect(result.condition).toBe("In");
  expect(result.value.length).toBe(3);
  expect(result.value[0]).toBe("1");
  expect(result.value[1]).toBe("2");
  expect(result.value[2]).toBe("3");

  // .$notIn logic tests
  result = parser._parseCondition({ "id.$notIn": "1,2,3" });
  expect(result.field).toBe("id");
  expect(result.condition).toBe("NotIn");
  expect(result.value.length).toBe(3);
  expect(result.value[0]).toBe("1");
  expect(result.value[1]).toBe("2");
  expect(result.value[2]).toBe("3");

  // .$between logic tests
  result = parser._parseCondition({ "age.$between": "18:30" });
  expect(result.field).toBe("age");
  expect(result.condition).toBe("Between");
  expect(result.value.length).toBe(2);
  expect(result.value[0]).toBe("18");
  expect(result.value[1]).toBe("30");

  // .$notBetween logic tests
  result = parser._parseCondition({ "age.$notBetween": "18:30" });
  expect(result.field).toBe("age");
  expect(result.condition).toBe("NotBetween");
  expect(result.value.length).toBe(2);
  expect(result.value[0]).toBe("18");
  expect(result.value[1]).toBe("30");

  // .$null logic tests
  testParser(parser, { "age.$null": null }, "age", "Null", null);

  // .$notNull logic tests
  testParser(parser, { "age.$notNull": null }, "age", "NotNull", null);

  // .$or logic tests
  result = parser._parseCondition({ "$or.age.$gt": 18 });
  expect(result.prefix).toBe("or");
  expect(result.field).toBe("age");
  expect(result.condition).toBe(">");
  expect(result.value).toBe(18);
});

test("I should be able to parsing all conditions", () => {
  const parser = new QueryParser({ model });
  const result = parser._parseConditions([
    { name: "Özgür" },
    { "$or.surname": "Işıklı" },
  ]);

  expect(result.length).toBe(2);
  expect(result[0].prefix).toBe(null);
  expect(result[0].field).toBe("name");
  expect(result[0].condition).toBe("=");
  expect(result[0].value).toBe("Özgür");

  expect(result[1].prefix).toBe("or");
  expect(result[1].field).toBe("surname");
  expect(result[1].condition).toBe("=");
  expect(result[1].value).toBe("Işıklı");
});

test("I should be able to parse recursive queries", () => {
  const parser = new QueryParser({ model });
  const result = parser._parseConditions([
    [{ name: "Özgür" }, { "$or.surname": "Işıklı" }],
    [{ "$or.id.$gt": 1 }, { "age.$gt": 18 }],
  ]);

  expect(result.length).toBe(2);
  expect(result[0].length).toBe(2);
  expect(result[0][0].field).toBe("name");
  expect(result[0][1].field).toBe("surname");

  expect(result[1].length).toBe(2);
  expect(result[1][0].field).toBe("id");
  expect(result[1][1].field).toBe("age");
});

test("I should be not able to add unacceptable field to query", () => {
  const parser = new QueryParser({ model });
  expect(() => {
    parser._parseCondition({ "full-name": "Özgür" });
  }).toThrow(Error);
  expect(() => {
    parser._parseCondition({ name$: "Özgür" });
  }).toThrow(Error);
  expect(() => {
    parser._parseCondition({ "name.": "Özgür" });
  }).toThrow(Error);
});

test("I should be able to apply general queries", () => {
  const query = {};
  query.where = jest.fn(() => {});
  query.orWhere = jest.fn(() => {});

  const parser = new QueryParser({ model });
  parser.applyWheres(query, {
    prefix: null,
    table: "users",
    field: "name",
    condition: "=",
    value: "Özgür",
  });
  parser.applyWheres(query, {
    prefix: "or",
    table: "users",
    field: "name",
    condition: "=",
    value: "Özgür",
  });

  expect(query.where.mock.calls.length).toBe(1);
  expect(query.where.mock.calls[0][0]).toBe("users.name");
  expect(query.where.mock.calls[0][1]).toBe("=");
  expect(query.where.mock.calls[0][2]).toBe("Özgür");

  expect(query.orWhere.mock.calls.length).toBe(1);
  expect(query.orWhere.mock.calls[0][0]).toBe("users.name");
  expect(query.orWhere.mock.calls[0][1]).toBe("=");
  expect(query.orWhere.mock.calls[0][2]).toBe("Özgür");
});

test("I should be able to apply one argument queries", () => {
  const query = {};
  query.whereIn = jest.fn(() => {});

  const parser = new QueryParser({ model });
  const value = ["Foo", "Bar"];
  parser.applyWheres(query, {
    prefix: null,
    table: "users",
    field: "name",
    condition: "In",
    value,
  });

  expect(query.whereIn.mock.calls.length).toBe(1);
  expect(query.whereIn.mock.calls[0][0]).toBe("users.name");
  expect(query.whereIn.mock.calls[0][1]).toBe(value);
});

test("I should be able to apply zero argument queries", () => {
  const query = {};
  query.whereNull = jest.fn(() => {});

  const parser = new QueryParser({ model });
  parser.applyWheres(query, {
    prefix: null,
    table: "users",
    field: "name",
    condition: "Null",
    value: null,
  });

  expect(query.whereNull.mock.calls.length).toBe(1);
  expect(query.whereNull.mock.calls[0][0]).toBe("users.name");
});

test("I should be able to apply multiple conditions", () => {
  const query = {};
  query.where = jest.fn(() => {});
  query.whereNull = jest.fn(() => {});

  const parser = new QueryParser({ model });
  parser.applyWheres(query, [
    {
      prefix: null,
      table: "users",
      field: "name",
      condition: "Null",
      value: null,
    },
    {
      prefix: null,
      table: "users",
      field: "surname",
      condition: "=",
      value: "Işıklı",
    },
  ]);

  expect(query.whereNull.mock.calls.length).toBe(1);
  expect(query.whereNull.mock.calls[0][0]).toBe("users.name");

  expect(query.where.mock.calls.length).toBe(1);
  expect(query.where.mock.calls[0][0]).toBe("users.surname");
  expect(query.where.mock.calls[0][1]).toBe("=");
  expect(query.where.mock.calls[0][2]).toBe("Işıklı");
});

test("I should be able to apply recursive conditions", () => {
  const query = {};
  const sub1 = {};
  const sub2 = {};

  sub1.where = jest.fn(() => {});
  sub1.whereNull = jest.fn(() => {});
  sub2.orWhere = jest.fn(() => {});
  sub2.where = jest.fn(() => {});

  query.where = jest.fn((sub) => {
    sub(sub1);
  });
  query.orWhere = jest.fn((sub) => {
    sub(sub2);
  });

  const parser = new QueryParser({ model });
  parser.applyWheres(query, [
    [
      {
        prefix: null,
        table: "users",
        field: "name",
        condition: "Null",
        value: null,
      },
      {
        prefix: null,
        table: "users",
        field: "surname",
        condition: "=",
        value: "Işıklı",
      },
    ],
    [
      { prefix: "or", table: "users", field: "id", condition: ">=", value: 0 },
      { prefix: null, table: "users", field: "age", condition: ">", value: 18 },
    ],
  ]);

  expect(query.where.mock.calls.length).toBe(1);
  expect(typeof query.where.mock.calls[0][0]).toBe("function");

  expect(query.orWhere.mock.calls.length).toBe(1);
  expect(typeof query.orWhere.mock.calls[0][0]).toBe("function");

  expect(sub1.whereNull.mock.calls.length).toBe(1);
  expect(sub1.whereNull.mock.calls[0][0]).toBe("users.name");
  expect(sub1.where.mock.calls.length).toBe(1);
  expect(sub1.where.mock.calls[0][0]).toBe("users.surname");
  expect(sub1.where.mock.calls[0][1]).toBe("=");
  expect(sub1.where.mock.calls[0][2]).toBe("Işıklı");

  expect(sub2.orWhere.mock.calls.length).toBe(1);
  expect(sub2.orWhere.mock.calls[0][0]).toBe("users.id");
  expect(sub2.orWhere.mock.calls[0][1]).toBe(">=");
  expect(sub2.orWhere.mock.calls[0][2]).toBe(0);

  expect(sub2.where.mock.calls.length).toBe(1);
  expect(sub2.where.mock.calls[0][0]).toBe("users.age");
  expect(sub2.where.mock.calls[0][1]).toBe(">");
  expect(sub2.where.mock.calls[0][2]).toBe(18);
});

test("I should be able to parse with to sections", () => {
  const parser = new QueryParser({ model });
  expect(parser._parseWithSections("posts").length).toBe(1);
  expect(parser._parseWithSections("posts,users").length).toBe(2);
  expect(parser._parseWithSections("post{id|title},user{name}").length).toBe(2);
  expect(
    parser._parseWithSections("post{title|created_at},user{name}").length
  ).toBe(2);
  expect(parser._parseWithSections("post{id|title|created_at}").length).toBe(1);
  expect(
    parser._parseWithSections("post{id|title|comments{title}},users.email")
      .length
  ).toBe(2);
});

test("I should be able to parse with to sections", () => {
  let result = null;
  const parser = new QueryParser({ model });
  expect(parser._parseWith(["posts", "users"]).length).toBe(2);
  expect(parser._parseWith(["post.comments"]).length).toBe(1);

  result = parser._parseWith(["post{id|title}"]);
  expect(result.length).toBe(1);
  expect(result[0].relationship).toBe("post");
  expect(result[0].fields.length).toBe(2);
  expect(result[0].fields[0]).toBe("id");
  expect(result[0].fields[1]).toBe("title");
  expect(result[0].children.length).toBe(0);

  result = parser._parseWith(["post{id|title}", "users"]);
  expect(result.length).toBe(2);
  expect(result[0].relationship).toBe("post");
  expect(result[0].fields.length).toBe(2);
  expect(result[0].children.length).toBe(0);

  expect(result[1].relationship).toBe("users");
  expect(result[1].fields.length).toBe(0);
  expect(result[1].children.length).toBe(0);

  result = parser._parseWith(["post{id|title|comments{title}}"]);
  expect(result.length).toBe(1);
  expect(result[0].relationship).toBe("post");
  expect(result[0].fields.length).toBe(2);
  expect(result[0].children.length).toBe(1);
  expect(result[0].children[0].relationship).toBe("comments");
  expect(result[0].children[0].fields.length).toBe(1);
  expect(result[0].children[0].fields[0]).toBe("title");
  expect(result[0].children[0].children.length).toBe(0);

  result = parser._parseWith(["post{id|comments{id|reports{id}}}"]);
  expect(result.length).toBe(1);
  expect(result[0].relationship).toBe("post");
  expect(result[0].children.length).toBe(1);
  expect(result[0].children[0].relationship).toBe("comments");
  expect(result[0].children[0].children.length).toBe(1);
  expect(result[0].children[0].children[0].relationship).toBe("reports");
  expect(result[0].children[0].children[0].fields.length).toBe(1);
  expect(result[0].children[0].children[0].fields[0]).toBe("id");
});

test("I should be able to split with recursive string", () => {
  const parser = new QueryParser({ model });
  let result = parser._splitWithRecursive("id|comments{id|reports{id}}");
  expect(result.length).toBe(2);
  expect(result[0]).toBe("id");
  expect(result[1]).toBe("comments{id|reports{id}}");

  result = parser._splitWithRecursive("id");
  expect(result.length).toBe(1);
  expect(result[0]).toBe("id");

  result = parser._splitWithRecursive("id|comments");
  expect(result.length).toBe(2);
  expect(result[0]).toBe("id");
  expect(result[1]).toBe("comments");

  result = parser._splitWithRecursive(
    "id|comments{id|reports{id|user{id|name|email}}}"
  );
  expect(result.length).toBe(2);
  expect(result[0]).toBe("id");
  expect(result[1]).toBe("comments{id|reports{id|user{id|name|email}}}");
});

test("I should be able to parse all sections", () => {
  const parser = new QueryParser({ model, options });
  const sections = {
    q: '{"id":10}',
    page: "1",
    per_page: "25",
    sort: "id,-name",
    fields: "id,name,surname",
    with: "users{id|posts{title}}",
  };
  const result = parser._parseSections(sections);

  // Pagination options
  expect(result.page).toBe(1);
  expect(result.per_page).toBe(25);

  // Field selections
  expect(result.fields.length).toBe(3);
  expect(result.fields[0]).toBe("id");
  expect(result.fields[1]).toBe("name");
  expect(result.fields[2]).toBe("surname");

  // Sorting selections
  expect(result.sort.length).toBe(2);
  expect(result.sort[0].field).toBe("id");
  expect(result.sort[0].type).toBe("ASC");
  expect(result.sort[1].field).toBe("name");
  expect(result.sort[1].type).toBe("DESC");

  // Query selections
  expect(result.q.prefix).toBe(null);
  expect(result.q.field).toBe("id");
  expect(result.q.condition).toBe("=");
  expect(result.q.value).toBe(10);

  // With selections
  expect(result.with.length).toBe(1);
  expect(result.with[0].relationship).toBe("users");
  expect(result.with[0].children[0].relationship).toBe("posts");
});

test("I should be able to get query parsing result", () => {
  const parser = new QueryParser({ model });
  const result = parser.get({});
  expect(result.page).toBe(1);
  expect(result.per_page).toBe(1);
});

test("I should be able to apply my field selections to query", () => {
  const query = {};
  query.select = jest.fn(() => {});
  const parser = new QueryParser({ model });
  parser.applyFields(query, "MyFields");

  expect(query.select.mock.calls.length).toBe(1);
  expect(query.select.mock.calls[0][0]).toBe("users.MyFields");
});

test("I should be able to apply sorting selection to the query", () => {
  const query = {};
  query.orderBy = jest.fn(() => {});
  const parser = new QueryParser({ model });
  parser.applySorting(query, [{ field: "id", type: "ASC" }]);

  expect(query.orderBy.mock.calls.length).toBe(1);
  expect(query.orderBy.mock.calls[0][0]).toBe("id");
  expect(query.orderBy.mock.calls[0][1]).toBe("ASC");
});

test("I should be able to apply see not using order by method when I don`t have any ordering option", () => {
  const query = {};
  query.orderBy = jest.fn(() => {});
  const parser = new QueryParser({ model });
  parser.applySorting(query, []);

  expect(query.orderBy.mock.calls.length).toBe(0);
});

test("I should not be able to send unacceptable query structure", () => {
  const parser = new QueryParser(options);
  const sections = {
    q: "id",
    page: null,
    per_page: null,
    sort: null,
    fields: null,
    with: null,
  };
  expect(() => {
    parser._parseSections(sections);
  }).toThrow();
});

test("I should be able to see like selector has been replaced", () => {
  const parser = new QueryParser({ model });

  const result = parser._parseCondition({ "name.$like": "*John*" });
  expect(result.field).toBe("name");
  expect(result.condition).toBe("LIKE");
  expect(result.value).toBe("%John%");
});
