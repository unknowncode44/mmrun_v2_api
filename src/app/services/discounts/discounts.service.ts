import { Injectable         } from '@nestjs/common';
import { InjectRepository   } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

// entidades
import { Discount           } from '../../entities/discount.entity';


@Injectable()
export class DiscountService extends TypeOrmCrudService<Discount> {
    constructor(@InjectRepository(Discount) repo) {
        super(repo)
    }
}