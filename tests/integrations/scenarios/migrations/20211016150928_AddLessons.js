export const up = function (knex) {
  const items = [
    { name: "AYT Matematik" },
    { name: "TYT Matematik" },
    { name: "Fizik" },
    { name: "Kimya" },
    { name: "Geometri" },
  ];

  return knex.table("lessons").insert(items);
};

export const down = function (knex) {};
