import { Body, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Item } from '../../entities/items.entity';

@Injectable()
export class MercadopagoService extends TypeOrmCrudService<Item> {
    
    constructor(@InjectRepository(Item) repo) {
        super(repo)
    }

    mercadopago = require('mercadopago')
    // Creamos una preferencia de pago:
    async paymentPreference(@Res() res, item: Item) {

        //! "sandbox_init_point" da la url de pago
        //! Access token seller
        this.mercadopago.configure({
            access_token: 'TEST-8966988389876831-071512-2602778a987cd58f778fa08f56e1ae20-1161315572' //? <-- Paste here
        })
        const preference = {
            items: [ {
                id: "",
                category_id: "",
                currency_id: "ARS",
                description: "",
                title: "Ball",
                quantity: 1,
                unit_price: 2000
            } ],
            back_urls: {
                success: "https://db3c-2800-2164-b400-dc-d857-f5c2-99ec-5340.ngrok-free.app/mercadopago/notification",
                failure: "https://db3c-2800-2164-b400-dc-d857-f5c2-99ec-5340.ngrok-free.app/mercadopago/notification",
                pending: "https://db3c-2800-2164-b400-dc-d857-f5c2-99ec-5340.ngrok-free.app/mercadopago/notification"
            },
            auto_return: 'approved',
            notification_url: "https://32de-2800-2164-b400-dc-d857-f5c2-99ec-5340.ngrok-free.app/mercadopago/notification"
        }
        this.mercadopago.preferences.create(preference)
            .then((r: any) => {
                res.json(r)
            })
            .catch((e: any) => {
                console.log(e);
            })
    }

    async paymentDone(@Body() body) {
        const paymentData = {
            transaction_amount: Number(body.transactionAmount),
            token: body.token,
            description: body.description,
            installments: Number(body.installments),
            payment_method_id: body.paymentMethodId,
            issuer_id: body.issuerId,
        };
        this.mercadopago.payment.save(paymentData)
            .then((response) => {
                const { response: data } = response
                console.log(data);
                
            })
            .catch(e => {
                console.log(e);
                
            })
    }
}
