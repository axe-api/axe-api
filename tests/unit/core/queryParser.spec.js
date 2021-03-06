import QueryParser from "./../../../src/core/QueryParser";
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
  let result = parser._parseCondition(expression);
  if (Array.isArray(result) && result.length === 1) {
    result = result[0];
  } else {
    console.log(result);
  }

  expect(result.field).toBe(field);
  expect(result.condition).toBe(condition);
  expect(result.value).toBe(value);
};

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
  const parser = new QueryParser({ model });
  expect(parser._parsePerPage("10")).toBe(10);
  expect(parser._parsePerPage("12")).toBe(12);
  expect(parser._parsePerPage("as")).toBe(10);
  expect(parser._parsePerPage("5")).toBe(5);
  expect(parser._parsePerPage(100)).toBe(100);
  expect(parser._parsePerPage(100000)).toBe(10);
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

  testParser(parser, { name: "??zg??r" }, "name", "=", "??zg??r");
  testParser(parser, { "id.$not": 1 }, "id", "<>", 1);
  testParser(parser, { "id.$gt": 1 }, "id", ">", 1);
  testParser(parser, { "id.$gte": 1 }, "id", ">=", 1);
  testParser(parser, { "id.$lt": 1 }, "id", "<", 1);
  testParser(parser, { "id.$lte": 1 }, "id", "<=", 1);
  testParser(parser, { "name.$like": "John*" }, "name", "LIKE", "John%");
  testParser(parser, { "name.$notLike": "John*" }, "name", "NOT LIKE", "John%");

  // .$in logic tests
  result = parser._parseCondition({ "id.$in": "1,2,3" });
  expect(result[0].field).toBe("id");
  expect(result[0].condition).toBe("In");
  expect(result[0].value.length).toBe(3);
  expect(result[0].value[0]).toBe("1");
  expect(result[0].value[1]).toBe("2");
  expect(result[0].value[2]).toBe("3");

  // .$notIn logic tests
  result = parser._parseCondition({ "id.$notIn": "1,2,3" });
  expect(result[0].field).toBe("id");
  expect(result[0].condition).toBe("NotIn");
  expect(result[0].value.length).toBe(3);
  expect(result[0].value[0]).toBe("1");
  expect(result[0].value[1]).toBe("2");
  expect(result[0].value[2]).toBe("3");

  // .$between logic tests
  result = parser._parseCondition({ "age.$between": "18:30" });
  expect(result[0].field).toBe("age");
  expect(result[0].condition).toBe("Between");
  expect(result[0].value.length).toBe(2);
  expect(result[0].value[0]).toBe("18");
  expect(result[0].value[1]).toBe("30");

  // .$notBetween logic tests
  result = parser._parseCondition({ "age.$notBetween": "18:30" });
  expect(result[0].field).toBe("age");
  expect(result[0].condition).toBe("NotBetween");
  expect(result[0].value.length).toBe(2);
  expect(result[0].value[0]).toBe("18");
  expect(result[0].value[1]).toBe("30");

  // .$null logic tests
  testParser(parser, { age: null }, "age", "Null", null);

  // .$notNull logic tests
  testParser(parser, { "age.$not": null }, "age", "NotNull", null);

  // .$or logic tests
  result = parser._parseCondition({ "$or.age.$gt": 18 });
  expect(result[0].prefix).toBe("or");
  expect(result[0].field).toBe("age");
  expect(result[0].condition).toBe(">");
  expect(result[0].value).toBe(18);

  // multiple logic in the same object
  result = parser._parseCondition({ id: 1, type: "User" });
  expect(result.length).toBe(2);
  expect(result[0].field).toBe("id");
  expect(result[1].field).toBe("type");
  expect(result[0].value).toBe(1);
  expect(result[1].value).toBe("User");
});

test("I should be able to parsing all conditions", () => {
  const parser = new QueryParser({ model });
  const result = parser._parseConditions([
    { name: "??zg??r" },
    { "$or.surname": "I????kl??" },
  ]);

  expect(result.length).toBe(2);
  expect(result[0][0].prefix).toBe(null);
  expect(result[0][0].field).toBe("name");
  expect(result[0][0].condition).toBe("=");
  expect(result[0][0].value).toBe("??zg??r");

  expect(result[1][0].prefix).toBe("or");
  expect(result[1][0].field).toBe("surname");
  expect(result[1][0].condition).toBe("=");
  expect(result[1][0].value).toBe("I????kl??");
});

test("I should be able to parse recursive queries", () => {
  const parser = new QueryParser({ model });
  const result = parser._parseConditions([
    [{ name: "??zg??r" }, { "$or.surname": "I????kl??" }],
    [{ "$or.id.$gt": 1 }, { "age.$gt": 18 }],
  ]);

  expect(result.length).toBe(2);
  expect(result[0].length).toBe(2);
  expect(result[0][0][0].field).toBe("name");
  expect(result[0][1][0].field).toBe("surname");

  expect(result[1].length).toBe(2);
  expect(result[1][0][0].field).toBe("id");
  expect(result[1][1][0].field).toBe("age");
});

test("I should be not able to add unacceptable field to query", () => {
  const parser = new QueryParser({ model });
  expect(() => {
    parser._parseCondition({ "full-name": "??zg??r" });
  }).toThrow(Error);
  expect(() => {
    parser._parseCondition({ name$: "??zg??r" });
  }).toThrow(Error);
  expect(() => {
    parser._parseCondition({ "name.": "??zg??r" });
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
    value: "??zg??r",
  });
  parser.applyWheres(query, {
    prefix: "or",
    table: "users",
    field: "name",
    condition: "=",
    value: "??zg??r",
  });

  expect(query.where.mock.calls.length).toBe(2);
  expect(typeof query.where.mock.calls[0][0]).toBe("function");
});

test("I should be able to apply one argument queries", () => {
  const query = {};
  query.whereIn = jest.fn(() => {});
  query.where = jest.fn((callback) => {
    callback(query);
  });

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
  query.where = jest.fn((callback) => {
    callback(query);
  });

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
  query.whereNull = jest.fn(() => {});
  query.where = jest.fn((callback) => {
    if (typeof callback === "function") {
      callback(query);
    }
  });

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
      value: "I????kl??",
    },
  ]);

  expect(query.whereNull.mock.calls.length).toBe(1);
  expect(query.whereNull.mock.calls[0][0]).toBe("users.name");

  expect(query.where.mock.calls.length).toBe(2);
  expect(query.where.mock.calls[1][0]).toBe("users.surname");
  expect(query.where.mock.calls[1][1]).toBe("=");
  expect(query.where.mock.calls[1][2]).toBe("I????kl??");
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
  const parser = new QueryParser({ model });
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
  expect(result.q[0].prefix).toBe(null);
  expect(result.q[0].field).toBe("id");
  expect(result.q[0].condition).toBe("=");
  expect(result.q[0].value).toBe(10);

  // With selections
  expect(result.with.length).toBe(1);
  expect(result.with[0].relationship).toBe("users");
  expect(result.with[0].children[0].relationship).toBe("posts");
});

test("I should be able to get query parsing result", () => {
  const parser = new QueryParser({ model });
  const result = parser.get({});
  expect(result.page).toBe(1);
  expect(result.per_page).toBe(10);
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
  const parser = new QueryParser({});
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
  expect(result[0].field).toBe("name");
  expect(result[0].condition).toBe("LIKE");
  expect(result[0].value).toBe("%John%");
});
