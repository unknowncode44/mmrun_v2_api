import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UiController } from '../../controllers/ui/ui.controller';
import { UiService } from '../../services/ui/ui.service';
import { UiElement } from 'src/app/entities/ui.entity';
import { Crud } from '@nestjsx/crud';

@Crud({
    model: {type: UiElement}
})
@Module({
    imports: [TypeOrmModule.forFeature([UiElement])],
    controllers: [UiController],
    providers: [UiService]
})
export class UiModule {}
