import { Module                 } from '@nestjs/common';
import { TypeOrmModule          } from '@nestjs/typeorm';
import { Crud                   } from '@nestjsx/crud';
import { DiscountsController    } from '../../controllers/discounts/discounts.controller';
import { DiscountService        } from '../../services/discounts/discounts.service';
import { Discount               } from '../../entities/discount.entity';

@Crud({
    model: {type: Discount}
})
@Module({
    imports: [TypeOrmModule.forFeature([Discount])],
    controllers: [DiscountsController],
    providers: [DiscountService]
})
export class DiscountsModule {}