import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Item } from "src/app/entities/items.entity";
import { Runner } from "src/app/entities/runner.entity";
import { User } from "src/app/entities/user.entity";


const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [ Runner, User, Item/* include entities here */],
    synchronize: true // set to false in production
};

console.log(dbConfig.host);


export default dbConfig