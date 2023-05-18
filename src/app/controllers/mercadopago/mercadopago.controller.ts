import { Controller, Get, Post, Req, Res } from '@nestjs/common';

@Controller('mercadopago')
export class MercadopagoController {

    mercadopago = require('mercadopago')

    @Get()
    test(): string {
        return 'test'
    }

    @Post('create-preference')
    async createPaymentPreference(@Res() res) {

        //! Access token seller
        this.mercadopago.configure({
            access_token: 'TEST-8966988389876831-071512-2602778a987cd58f778fa08f56e1ae20-1161315572' //? <-- Paste here
        })

        const preference = {
            items: [
                {
                    title: 'Ball', //! ITEM NAME
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: 2000 //! PRICE
                }
            ],
            back_urls: {
                success: "http://localhost:3000/mercadopago",
                failure: "http://localhost:3000/mercadopago",
                pending: "http://localhost:3000/mercadopago"
            },
            auto_return: 'approved',
            notification_url: 'https://3937-2800-2164-b400-dc-d261-567d-e0bd-bdd6.ngrok-free.app/mercadopago/create-preference'
        }
        this.mercadopago.preferences.create(preference)
            .then((r: any) => {
                res.json(r)
            })
            .catch((e: any) => {
                console.log(e);
            })
    }
    @Post('notification')
    notification(@Req() req, @Res() res) {
        const data = req.query

        console.log(data);
        
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