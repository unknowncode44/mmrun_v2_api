import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Sponsor } from '../../entities/sponsor.entity'

@Injectable()
export class SponsorsService extends TypeOrmCrudService<Sponsor> {
    constructor(@InjectRepository(Sponsor) repo) {
        super(repo)
    }
}
