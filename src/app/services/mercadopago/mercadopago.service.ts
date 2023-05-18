import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadopagoService {
    mercadopago = require('mercadopago')
    constructor() {
        //Configuramos las credenciales de mercado pago
        this.mercadopago.configure({
            access_token: 'TEST-8715927984190297-071413-bda330adc2daee65c12e118edd6707aa-213887771'
        })
    }

    
    // Creamos una preferencia de pago:
    async paymentPreference(/*@Res() res*/) {
        const preference = {
            item: [
                {
                    title: "Título",
                    unit_price: 200,
                    quantity: 1
                }
            ],
            /*back_urls: {
                success: "http://link-success.com.ar",
                failure: "http://link-failure.com.ar",
                pending: "http://link-pending.com.ar"
            },
            auto_return: 'approved'*/
            notification_url: 'https://f973-2800-2164-b400-dc-d261-567d-e0bd-bdd6.ngrok-free.app/mercadopago/crear-preferencia'
        }

        try {
            const response = await this.mercadopago.preferences.create(preference)
            return response.body.init_point
            /*this.mercadopago.preferences.create(preference)
                .then((r: any) => {
                    res.json(r)
                })
                .catch((e: any) => {
                    console.log(e)
                    
                })*/
        }
        catch (e) {
            throw new Error('Error creating payment reference')
        }
    }
}
