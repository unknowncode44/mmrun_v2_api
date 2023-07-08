import { TypeOrmModuleOptions   } from "@nestjs/typeorm"

// entidades
import { Category               } from "../app/entities/category.entity";
import { Item                   } from "../app/entities/items.entity";
import { Runner                 } from "../app/entities/runner.entity";
import { UiElement              } from "../app/entities/ui.entity";
import { User                   } from "../app/entities/user.entity";
import { Discount               } from "../app/entities/discount.entity";
import { Sponsor                } from "../app/entities/sponsor.entity";


const dbConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [ Runner, User, Item, UiElement, Category, Discount, Sponsor/* include entities here */],
    synchronize: true // set to false in production
};

console.log(dbConfig.host);


export default dbConfig