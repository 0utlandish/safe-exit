const sqlite3 = require("sqlite3").verbose();
const md5 = require("md5");
const {readFromSqlFile, getListOfMigrations, migrate} = require("./helpers");

const src = "src/database/storage.sqlite";

const migrations = getListOfMigrations();

let database = new sqlite3.Database(src, async (err) => {
   if (err) {
      console.error(err.message);
      throw err;
   } else {
      console.log("Connected to the SQLite database.");
      migrate(database, migrations);
   }
});
