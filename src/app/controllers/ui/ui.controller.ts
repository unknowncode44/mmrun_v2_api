import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { UiElement } from '../../entities/ui.entity';
import { UiService } from '../../services/ui/ui.service';


@Crud({
    model: {type: UiElement}
})
@Controller('ui')
export class UiController {
    constructor(public service: UiService){}
}
