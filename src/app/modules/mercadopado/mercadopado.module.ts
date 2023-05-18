import { Module } from '@nestjs/common';
import { MercadopagoController } from 'src/app/controllers/mercadopago/mercadopago.controller';
import { MercadopagoService } from 'src/app/services/mercadopago/mercadopago.service';

@Module({
    imports: [], 
    controllers: [MercadopagoController],
    providers: [MercadopagoService]
})
export class MercadopadoModule {}
