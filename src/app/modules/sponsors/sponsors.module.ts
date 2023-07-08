import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from '@nestjsx/crud';
import { SponsorsController } from '../../controllers/sponsors/sponsors.controller';
import { SponsorsService    } from '../../services/sponsors/sponsors.service';
import { Sponsor            } from '../../entities/sponsor.entity';

@Crud({
    model: {type: Sponsor}
})
@Module({
    imports: [TypeOrmModule.forFeature([Sponsor])],
    controllers: [SponsorsController],
    providers: [SponsorsService]
})
export class SponsorsModule {}
