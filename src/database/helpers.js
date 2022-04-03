const fs = require('fs');
const { resolve } = require('path');

const readFromSqlFile = function(queryName) {
   return fs.readFileSync(`src/database/${queryName}.sql`).toString();
}

const getListOfMigrations = function() {
   return fs.readdirSync('src/database/migrations');
}

const migrate = async function(database, listOfMigrations) {
   console.log('[Server] Start migrating database...');
   for (migration of listOfMigrations) {
      const migrationName = migration.split('.')[0];
      const migrationQuery = readFromSqlFile(`migrations/${migrationName}`);
      if (migrationName != '00_create_migrations_table') {
         const marked = await new Promise((resolve, reject) => {
            database.all("SELECT * FROM migrations WHERE migration = ?", [migrationName], (err, rows) => {
               resolve((rows.length != 0));
            });
         });
         if (marked) continue;
      }
      console.log(`[Server] Running migration ${migrationName}`);
      await new Promise((resolve, reject) => {
         database.run(migrationQuery, function(err) {
            if (err) {
               console.error(err.message);
               reject();
               throw err;
            } else {
               console.log(`[Server] Migrated ${migrationName}`);
               if (migrationName != '00_create_migrations_table') {
                  database.run(readFromSqlFile('queries/mark_migration'), [migrationName]);
               }
               resolve(migrationName);
            }
         });
      });
   }
   console.log('[Server] Migration done.');
}

module.exports = {
   readFromSqlFile,
   getListOfMigrations,
   migrate
};