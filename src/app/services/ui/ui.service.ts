import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UiElement } from '../../entities/ui.entity';


@Injectable()
export class UiService extends TypeOrmCrudService<UiElement> {
    constructor(@InjectRepository(UiElement) repo) {
        super(repo)
    }
}
