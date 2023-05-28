import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunnersController } from '../../controllers/runners/runners.controller';
import { RunnersService } from '../../services/runners/runners.service';
import { Runner } from '../../entities/runner.entity';
import { Crud } from '@nestjsx/crud';

@Crud({
    model: {type: Runner}
})

@Module({
    imports: [TypeOrmModule.forFeature([Runner])],
    controllers: [RunnersController],
    providers: [RunnersService]
})
export class RunnersModule {}
