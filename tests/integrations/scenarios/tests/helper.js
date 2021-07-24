/* eslint-disable no-undef */
import request from "supertest";
import mysql from "mysql";

export const get = async ({ url, status }) => {
  return await request("localhost:3000")
    .get(url)
    .expect("Content-Type", /json/)
    .expect(status);
};

export const post = async ({ url, data, status }) => {
  return await request("localhost:3000")
    .post(url)
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
};

export const put = async ({ url, data, status }) => {
  return await request("localhost:3000")
    .put(url)
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
};

export const deleteIt = async ({ url, status }) => {
  return await request("localhost:3000")
    .delete(url)
    .expect("Content-Type", /json/)
    .expect(status);
};

const truncateMySQL = async (table) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SET FOREIGN_KEY_CHECKS = 0;", function (err) {
      if (err) throw err;
      connection.query(`TRUNCATE TABLE ${table}`, function (err) {
        if (err) throw err;
      });
    });
  });
};

export const truncate = async (table) => {
  switch (process.env.DB_CLIENT) {
    case "mysql":
      return await truncateMySQL(table);
    default:
      throw new Error(`Unknown DB client: ${process.env.DB_CLIENT}`);
  }
};
