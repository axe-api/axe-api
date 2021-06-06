import mysql from "mysql";

const attemptMySQL = (port, success) => {
  process.stdout.write(`Connecting to MySQL [${port}]...`);
  const connection = mysql.createConnection({
    host: "localhost",
    user: "axeapi",
    password: "123456",
    database: "axeapi",
    port,
  });
  connection.connect((err) => {
    if (err) {
      process.stdout.write("Failed!\n");
      return setTimeout(() => {
        attemptMySQL(port, success);
      }, 5000);
    }
    process.stdout.write("Success!\n");
    connection.end();
    success();
  });
};

export { attemptMySQL };
