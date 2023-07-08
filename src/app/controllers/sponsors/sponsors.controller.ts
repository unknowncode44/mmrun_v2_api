import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud'
import { Sponsor } from '../../entities/sponsor.entity';
import { SponsorsService } from '../../services/sponsors/sponsors.service';


@Crud({
    model: {type: Sponsor}
})
@Controller('sponsors')
export class SponsorsController {
    constructor(public service: SponsorsService){}
}
