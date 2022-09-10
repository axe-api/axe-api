const up = function (knex) {
  const items = [
    { name: "Math" },
    { name: "Computer Science" },
    { name: "Network" },
  ];

  return knex.table("lessons").insert(items);
};

const down = function (knex) {};

module.exports = { up, down };
