import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Item } from 'src/app/entities/items.entity';
import { MercadopagoService } from 'src/app/services/mercadopago/mercadopago.service';


@Crud({
    model: { type: Item }
})

@Controller('mercadopago')
export class MercadopagoController {

    constructor(private readonly service: MercadopagoService){}

    @Post('create-preference')
    async createPaymentPreference(@Res() res, @Body('item') item: Item) {
        this.service.paymentPreference(res, item)
    }

    mercadopago = require('mercadopago')
    @Post('notification')
    notification(@Req() req, @Res() res) {
        const {body} = req.query
        this.mercadopago.payment.save(body)
            .then(data => {
                console.log(data);
            })
        console.log(body);
        
        res.status(200)
    }

}

/*
APPROVED
mercadopago?collection_id=1314991425&
collection_status=approved&
payment_id=1314991425&
status=approved&
external_reference=null&
payment_type=credit_card&
merchant_order_id=9319863562&
preference_id=1161315572-893049b6-e55b-4841-9cd2-f9178abb91a5&
site_id=MLA&
processing_mode=aggregator&
merchant_account_id=null

REJECTED
mercadopago?collection_id=1314989467&
collection_status=rejected&
payment_id=1314989467&
status=rejected&
external_reference=null&
payment_type=credit_card&
merchant_order_id=9319177433&
preference_id=1161315572-cb673905-335c-424b-809b-62523c494c6d&
site_id=MLA&
processing_mode=aggregator&
merchant_account_id=null

PENDING
mercadopago?collection_id=1314989493&
collection_status=in_process&
payment_id=1314989493&
status=in_process&
external_reference=null&
payment_type=credit_card&
merchant_order_id=9320073688&
preference_id=1161315572-6e15e698-7f7c-43ac-accc-938479211315&
site_id=MLA&
processing_mode=aggregator&
merchant_account_id=null
*/