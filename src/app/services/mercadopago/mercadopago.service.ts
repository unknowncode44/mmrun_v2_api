import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Item } from '../../entities/items.entity';
import axios from 'axios';

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
            access_token: process.env.ACCESS_TOKEN //? <-- Paste here
        })
        const preference = {
            items: [ item ],
            back_urls: {
                success: "https://mmrun-fda85.web.app/",
                failure: "https://mmrun-fda85.web.app/",
                pending: "https://mmrun-fda85.web.app/"
            },
            auto_return: 'approved',
            notification_url: "https://3a2e-2800-2164-b400-dc-16b1-37dd-a95d-d797.ngrok-free.app/mercadopago/notification"
        }
        this.mercadopago.preferences.create(preference)
            .then((r: any) => {
                res.json(r)
            })
            .catch((e: any) => {
                console.log(e);
            })
    }

    async fetchData(id: any): Promise<any> {
        const url = `https://api.mercadopago.com/v1/payments/${id}`;
        const token = process.env.ACCESS_TOKEN; // Reemplaza esto con tu token real

        try {
            const response = await axios.get(url, {
            headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

          // Procesa la respuesta de la API aquí
            return response.data

        } catch (error) {
          // Manejo de errores
            console.error(error);
        }
    }

}
