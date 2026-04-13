import typeorm = require("typeorm")

 export const AppDatasorce = new typeorm.DataSource({
    type:"better-sqlite3",
    database:"database.db",
    synchronize:false,
    logging:true,
    entities:["src/entity/**.ts"],
    migrations:["src/migrations/*.ts"],
})
