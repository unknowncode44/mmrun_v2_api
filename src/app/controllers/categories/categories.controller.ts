import { Controller         } from '@nestjs/common';
import { Crud               } from '@nestjsx/crud'
import { Category           } from '../../entities/category.entity';
import { CategoriesService  } from '../../services/categories/categories.service';


@Crud({
    model: {type: Category}
})
@Controller('categories')
export class CategoriesController {
    constructor(public service: CategoriesService){}
}
