export const up = function (knex) {
  const items = [
    { name: "Math" },
    { name: "Computer Science" },
    { name: "Network" },
  ];

  return knex.table("lessons").insert(items);
};

export const down = function (knex) {};
