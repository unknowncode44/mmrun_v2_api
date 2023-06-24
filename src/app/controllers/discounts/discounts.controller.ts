import { Controller         } from '@nestjs/common';
import { Crud               } from '@nestjsx/crud'
import { Discount           } from '../../entities/discount.entity';
import { DiscountService    } from '../../services/discounts/discounts.service';


@Crud({
    model: {type: Discount}
})
@Controller('discounts')
export class DiscountsController {
    constructor(public service: DiscountService){}
}