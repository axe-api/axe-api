/* eslint-disable no-undef */
const request = require("supertest");
const mysql = require("mysql");
const mysql2 = require("mysql2");
const sqlite3 = require("sqlite3");
const axios = require("axios");
const { Pool } = require("pg");

const get = async ({ url, status }) => {
  return await request("localhost:3000")
    .get(url)
    .expect("Content-Type", /json/)
    .expect(status);
};

const post = async ({ url, data, status }) => {
  return await request("localhost:3000")
    .post(url)
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
};

const put = async ({ url, data, status }) => {
  return await request("localhost:3000")
    .put(url)
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
};

const patch = async ({ url, data, status }) => {
  try {
    return await request("localhost:3000")
      .patch(url)
      .send(data)
      .expect("Content-Type", /json/)
      .expect(status);
  } catch (error) {
    console.log(error);
  }
};

const deleteIt = async ({ url, status }) => {
  return await request("localhost:3000").delete(url).expect(status);
};

const truncateMySQL = async (table) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  return new Promise((resolve) => {
    connection.connect(function (err) {
      if (err) throw err;
      connection.query("SET FOREIGN_KEY_CHECKS = 0;", function (err) {
        if (err) throw err;
        const sql = `TRUNCATE TABLE ${table}`; //NOSONAR
        connection.query(sql, function (err) {
          if (err) throw err;
          resolve();
        });
      });
    });
  });
};

const truncateMySQL2 = async (table) => {
  const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  return new Promise((resolve) => {
    connection.connect(function (err) {
      if (err) throw err;
      connection.query("SET FOREIGN_KEY_CHECKS = 0;", function (err) {
        if (err) throw err;
        const sql = `TRUNCATE TABLE ${table}`; //NOSONAR
        connection.query(sql, function (err) {
          if (err) throw err;
          resolve();
        });
      });
    });
  });
};

const truncateSQLite = async (table) => {
  const instance = sqlite3.verbose();
  const connection = new instance.Database("./axedb.sql");

  return new Promise((resolve) => {
    const sql = `DELETE FROM ${table}`; //NOSONAR
    connection.run(sql, function (err) {
      if (err) throw err;
      resolve();
    });
  });
};

const truncatePostgres = async (table) => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    searchPath: [process.env.DB_USER, "public"],
  });
  const sql = `TRUNCATE TABLE ${table} CASCADE`; //NOSONAR
  await pool.query(sql);
  await pool.end();
};

const truncate = async (table) => {
  switch (process.env.DB_CLIENT) {
    case "mysql":
      return await truncateMySQL(table);
    case "mysql2":
      return await truncateMySQL2(table);
    case "sqlite3":
      return await truncateSQLite(table);
    case "postgres":
    case "cockroachdb":
      return await truncatePostgres(table);
    default:
      throw new Error(`Unknown DB client: ${process.env.DB_CLIENT}`);
  }
};

const axiosRequest = async (method, url, data) => {
  try {
    return await axios[method](url, data);
  } catch (error) {
    return error.response;
  }
};

const axiosPost = async (url, data) => await axiosRequest("post", url, data);
const axiosGet = async (url, data) => await axiosRequest("get", url, data);
const axiosPut = async (url, data) => await axiosRequest("put", url, data);
const axiosPatch = async (url, data) => await axiosRequest("patch", url, data);
const axiosDelete = async (url, data) =>
  await axiosRequest("delete", url, data);

module.exports = {
  get,
  post,
  put,
  patch,
  deleteIt,
  truncate,
  axiosPost,
  axiosGet,
  axiosPut,
  axiosPatch,
  axiosDelete,
};
