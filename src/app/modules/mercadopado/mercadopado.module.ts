import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadopagoController } from 'src/app/controllers/mercadopago/mercadopago.controller';
import { Item } from 'src/app/entities/items.entity';
import { MercadopagoService } from 'src/app/services/mercadopago/mercadopago.service';
import { Crud } from '@nestjsx/crud';

@Crud({
    model: { type: Item }
})
@Module({
    imports: [TypeOrmModule.forFeature([Item])], 
    controllers: [MercadopagoController],
    providers: [MercadopagoService]
})
export class MercadopadoModule {}
