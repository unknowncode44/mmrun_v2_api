import { Module         } from '@nestjs/common';
import { AppController  } from '../controllers/app.controller';
import { AppService     } from '../services/app.service';
import { TypeOrmModule  } from '@nestjs/typeorm';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// modulos propios
import { UsersModule        } from './users/users.module';
import { RunnersModule      } from './runners/runners.module';
import { CategoriesModule   } from './categories/categories.module';
import { SponsorsModule     } from './sponsors/sponsors.module';
import { UiModule           } from './ui/ui.module';
import { AuthModule         } from '../modules/auth/auth.module';
import { DiscountsModule    } from './discounts/discounts.module';


// debug 
import { DevtoolsModule } from '@nestjs/devtools-integration'

import dbConfig from 'src/database/config';

@Module({
  imports: [
    // solo para debug
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
    }),   
    //
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    RunnersModule,
    CategoriesModule,
    SponsorsModule,
    UiModule,
    AuthModule,
    DiscountsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','uploads')
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
