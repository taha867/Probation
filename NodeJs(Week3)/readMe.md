**To run my database commans:** `sudo -u postgres psql -d blogdb`

**DB PAssword is:** `DbPassword12345`


- **Run all pending migrations (up):** `npx sequelize db:migrate`
- **Revert the last migration (down):** `npx sequelize db:migrate:undo`
- **Revert all migrations:** `npx sequelize db:migrate:undo:all`
- **Generate a new model with migration:** `npx sequelize model:generate --name ModelName --attributes field1:type,field2:type`
- **Run all seeders:** `npx sequelize db:seed:all`
- **Revert the last seeder:** `npx sequelize db:seed:undo`
- **check how many are up and down:** `npx sequelize db:migrate:status`
- **revert back to specific migration:** `npx sequelize-cli db:migrate:undo:all --to 20251124100000-create-post.js`



**Next, we run the migration to create the DB tables:**
`npx sequelize-cli db:migrate`
**Our database is now created.**

**Run this command**
`npm run db:migrate`
