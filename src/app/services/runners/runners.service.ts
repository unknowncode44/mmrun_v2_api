import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Runner } from '../../entities/runner.entity'

@Injectable()
export class RunnersService extends TypeOrmCrudService<Runner> {
    constructor(@InjectRepository(Runner) repo) {
        super(repo)
    }
}
