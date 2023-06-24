import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Item } from '../../entities/items.entity';
import axios from 'axios';
import { transporter } from 'src/main';



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
                success: process.env.SITE+"/confirmation",
                failure: process.env.SITE+"/confirmation",
                pending: process.env.SITE+"/confirmation"
            },
            auto_return: 'approved',
            notification_url: process.env.URL+"/mercadopago/notification"
        }
        this.mercadopago.preferences.create(preference)
            .then((r: any) => {
                console.log(
                    `CREATING REFERENCE:
                    ${JSON.stringify(r)}`
                )
                res.json(r)
            })
            .catch((e: any) => {
                console.log(e);
            })
    }

    async fetchData(id: any): Promise<any> {
        console.log(id)

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
            console.error(`Error durante la obtencion de datos desde el endpoint de mercadopago: ${error}`);
        }
    }

    async fetchRunners(): Promise<any> {
        const url: string = process.env.URL+'/runners'
        try {
            const response = axios.get(url)
            return response
            
        } catch (error) {
            // Manejo de errores
            console.error(error);
        }
    }

    async updateRunner(runnerId: number, runner: any): Promise<any> {
        const url: string = process.env.URL+'/runners/'+runnerId
        try {
            const response = axios.put(url,runner)
            return response
        } catch (e) {
            
        }
    }

    async sendMail(email: string, name: string, distance: string, runnerNumber: string){
        let _email = process.env.EMAIL
        try {
            await transporter.sendMail({
                from: `"Mari Menuco Run <${_email}>`,
                to: "matiaz.orellana@gmail.com",
                subject: 'Confirmación de inscripción',
                text: 'Confirmación',
                html: `<h2>${name} / ${runnerNumber}<h2>`
            })
            
        } catch (error) {
            console.log(error)
        }
    }



}
