import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud'
import { Runner } from '../../entities/runner.entity'
import { RunnersService } from '../../services/runners/runners.service';

@Crud({
    model: {type: Runner}
})
@Controller('runners')
export class RunnersController {
    constructor(public service: RunnersService){}
}
