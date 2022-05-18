var pgtools = require("pgtools");
const config = {
  user: "postgres",
  host: "your_host",
  password: "your_password",
  port: 5432,
};

pgtools.createdb(config, "your_database", function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log(res);
});
