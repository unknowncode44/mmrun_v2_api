import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RunnersModule } from './runners/runners.module';
import { CategoriesModule } from './categories/categories.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { UiModule } from './ui/ui.module';
import dbConfig from 'src/database/config';
import { MercadopadoModule } from './mercadopado/mercadopado.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    RunnersModule,
    CategoriesModule,
    SponsorsModule,
    UiModule,
    MercadopadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
