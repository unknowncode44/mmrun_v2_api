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
    async paymentPreference(@Res() res, item: Item, id: string) {

        //! "sandbox_init_point" da la url de pago
        //! Access token seller
        this.mercadopago.configure({
            access_token: process.env.ACCESS_TOKEN //? <-- Paste here
        })
        console.log(`Este es identification number: ${id}`)
        const preference = {
            items: [ item ],
            back_urls: {
                success: process.env.SITE+"/#/confirmation/success/"+id,
                failure: process.env.SITE+"/#/",
                pending: process.env.SITE+"/#/confirmation/pending/"+id
            },
            auto_return: 'approved',
            notification_url: process.env.URL+"/mercadopago/notification"
        }
        this.mercadopago.preferences.create(preference)
            .then((r: any) => {
                // console.log('Referencia creada:');
                // console.log(JSON.stringify(r.body))
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
            // console.log('Pago encontrado')
            // console.log(response.data)
            
            return response.data

        } catch (error) {
            console.error(`Error durante la obtencion de datos desde el endpoint de mercadopago: ${error}`);
            return error
            
        }
    }

    async fetchMerchantOrder(url: string): Promise<any> {
        const token = process.env.ACCESS_TOKEN; // Reemplaza esto con tu token real
        try {
            const response = await axios.get(url, {
                headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Procesa la respuesta de la API aquí
                // console.log('Pago encontrado')
                // console.log(response.data)

                if(response.data.payments.length > 0) {
                    return {
                        status:  response.data.payments[0].status, 
                        title: response.data.items[0].title, 
                        payment_id: response.data.payments[0].id 
                    }
                }
                else {
                    return {
                        status: 'pending', 
                        title: response.data.items[0].title, 
                        payment_id: null,
                    }
                }


        }
        catch(e){
            console.error(`Error durante la obtencion de datos desde el endpoint MERCHANT de mercadopago: ${e}`);
            return e

        }


    }

    async fetchRunners(): Promise<any> {
        const url: string = process.env.URL+'/runners'
        try {
            const response = await axios.get(url)
            return response
            
        } catch (error) {
            // Manejo de errores
            console.error(error);
        }
    }

    async fetchUniqueRunner(id: string): Promise<any> {
        const url: string = process.env.URL+'/runners/'+id
        try {
            const response = await axios.get(url)
            return response
        }
        catch (error) {
            console.error(error)
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

    async sendMail(email: string, name: string, distance: string, runnerNumber: string, approved?: boolean, checkUrl?: string){
        //let _email = process.env.EMAIL
        if(approved === true){
            try {
                await transporter.sendMail({
                    from: `notificaciones@mmrun.com.ar`,
                    to: email,
                    subject: 'Confirmación de inscripción',
                    text: 'Confirmación, pago realizado con exito',
                    html: `
                    <style>
                    .wrapper {
                        height: 100vh;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        padding: 0.5rem;
                        align-items: center;
                        justify-content: center;
                        padding: 0px 15rem;
                    }
                    
                    .wrapper .card {
                        display: flex;
                        flex-direction: column;
                        min-width: 99%;
                        min-height: 99%;
                        border-radius: 2%;
                        background: #44226e;
                    }
                    .wrapper .card .header {
                        text-align: center;
                        padding: 0px 1rem;
                    }
                    .wrapper .card .header h2 {
                        font-weight: 800;
                        text-transform: uppercase;
                        font-size: 1.2em;
                    }
                    .wrapper .card .header h4 {
                        font-weight: 600;
                    }
                    .wrapper .card .header p {
                        text-align: justify;
                        margin: 0.5rem 0px;
                    }
                    .wrapper .card .header p a {
                        color: #00FABA;
                        font-weight: 600;
                    }
                        
                    .wrapper .card .runner-number {
                        margin: 1.2rem 0px;
                        width: 100%;
                        background: #00FABA;
                        height: 20%;
                        text-align: center;
                    }
                    .wrapper .card .runner-number h3 {
                        font-weight: 800;
                        color: #44226e;
                        font-size: 1.2em;
                        text-transform: uppercase;
                    }
                    .wrapper .card .runner-number h1 {
                        font-weight: 800;
                        font-size: 3.5em;
                        color: #44226e;
                    }

                    
                    </style>

                    <div class="wrapper">
                        <div class="card">
                            <div class="header">
                                <h2>Pago Confirmado!</h2>
                                <h4>${name}, gracias por participar!</h4>
                                <p>Ya recibimos tu pago por ${distance}! Debajo puedes ver tu numero de corredor. Si tienes consultas o dudas nos puedes escribir a <a href="https://api.whatsapp.com/send?phone=542995817788&text=%C2%A1Hola%21+MMRUN" target="_blank">este numero</a></p>
                            </div>
                            <div class="runner-number">
                                <h3>Corredor Numero</h3>
                                <h1>${runnerNumber}</h1>
                                
                            </div>
                            
                            <div class="offers">
                                <p><strong>Con tu inscripción a Mari Menuco Run tenes 20% off en imperdibles descuentos abonando en efectivo:</strong></p>
                                <br>
                                <ul>
                                    <li>Aberturas de aluminio Divanni, con guarda de materiales por tiempo indeterminado</li>
                                    <li>Alinea tu alimentación y mejora tu rendimiento deportivo con Camila sabatini, nutricionista de nuestro staff</li>
                                </ul> 
                            </div>

                        </div>
                    </div>`
                })
                
            } catch (error) {
                console.log(error)
            }
        }
        else {
            try {
                await transporter.sendMail({
                    from: `notificaciones@mmrun.com.ar`,
                    to: email,
                    subject: 'Confirmación de inscripción',
                    text: 'Inscripción Pendiente',
                    html: `
                    <style>
                    .wrapper {
                        height: 100vh;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        padding: 0.5rem;
                        align-items: center;
                        justify-content: center;
                        padding: 0px 15rem;
                    }
                    
                    .wrapper .card {
                        display: flex;
                        flex-direction: column;
                        min-width: 99%;
                        min-height: 99%;
                        border-radius: 2%;
                        background: #44226e;
                    }
                    .wrapper .card .header {
                        text-align: center;
                        padding: 0px 1rem;
                    }
                    .wrapper .card .header h2 {
                        font-weight: 800;
                        text-transform: uppercase;
                        font-size: 1.2em;
                    }
                    .wrapper .card .header h4 {
                        font-weight: 600;
                    }
                    .wrapper .card .header p {
                        text-align: justify;
                        margin: 0.5rem 0px;
                    }
                    .wrapper .card .header p a {
                        color: #00FABA;
                        font-weight: 600;
                    }
                        
                    .wrapper .card .runner-number {
                        margin: 1.2rem 0px;
                        width: 100%;
                        background: #00FABA;
                        height: 20%;
                        text-align: center;
                    }
                    .wrapper .card .runner-number h3 {
                        font-weight: 800;
                        color: #44226e;
                        font-size: 1.2em;
                        text-transform: uppercase;
                    }
                    .wrapper .card .runner-number h1 {
                        font-weight: 800;
                        font-size: 3.5em;
                        color: #44226e;
                    }
                    </style>

                    <div class="wrapper">
                        <div class="card">
                            <div class="header">
                                <h2>Pago pendiente de confirmacion!</h2>
                                <h4>${name}, gracias por participar!</h4>
                                <p>Tu pago por ${distance} esta siendo procesado, te notificaremos a la direccion de mail una vez que se haya acreditado. Debajo puedes ver tu numero de corredor, pero recuerda que si el pago no se acredita en las proximas 48hs el mismo puede cambiar. En caso de que tengas dudas o consultas puedes escribirnos a <a href="https://api.whatsapp.com/send?phone=542995817788&text=%C2%A1Hola%21+MMRUN" target="_blank">este numero</a></p>
                                <p>Puedes chequear el estado de tu pago haciendo click <a href="${checkUrl}">aqui</a></p>
                            </div>
                            <div class="runner-number">
                                <h3>Corredor Numero</h3>
                                <h1>${runnerNumber}</h1>
                            </div>
                        </div>
                    </div>`
                })
                
            } catch (error) {
                console.log(error)
            }
        }
    }

    async sendMailWalk(email: string, name: string, runnerNumber: string) {
        try {
            await transporter.sendMail({
                from: `notificaciones@mmrun.com.ar`,
                to: email,
                subject: 'Confirmación de inscripción',
                text: 'Confirmación exitosa',
                html: `
                <style>
                .wrapper {
                    height: 100vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 0.5rem;
                    align-items: center;
                    justify-content: center;
                    padding: 0px 15rem;
                }
                
                .wrapper .card {
                    display: flex;
                    flex-direction: column;
                    min-width: 99%;
                    min-height: 99%;
                    border-radius: 2%;
                    background: #D6D5D7;
                }
                .wrapper .card .header {
                    text-align: center;
                    padding: 0px 1rem;
                }
                .wrapper .card .header h2 {
                    font-weight: 800;
                    text-transform: uppercase;
                    font-size: 1.2em;
                }
                .wrapper .card .header h4 {
                    font-weight: 600;
                }
                .wrapper .card .header p {
                    text-align: justify;
                    margin: 0.5rem 0px;
                }
                .wrapper .card .header p a {
                    color: #00FABA;
                    font-weight: 600;
                }
                    
                .wrapper .card .runner-number {
                    margin: 1.2rem 0px;
                    width: 100%;
                    background: #00FABA;
                    height: 20%;
                    text-align: center;
                }
                .wrapper .card .runner-number h3 {
                    font-weight: 800;
                    color: #44226e;
                    font-size: 1.2em;
                    text-transform: uppercase;
                }
                .wrapper .card .runner-number h1 {
                    font-weight: 800;
                    font-size: 3.5em;
                    color: #44226e;
                }

                

                
                </style>

                <div class="wrapper">
                    <div class="card">
                        <div class="header">
                            <h2>Inscripcion Confirmada</h2>
                            <h4>${name}, gracias por participar!</h4>
                           
                        </div>
                        <div class="runner-number">
                            <h3>Corredor Numero</h3>
                            <h1>${runnerNumber}</h1>
                            
                        </div>
                        
                        <div class="offers">
                            <p><strong>Con tu inscripción a Mari Menuco Run tenes 20% off en imperdibles descuentos abonando en efectivo:</strong></p>
                            <br>
                            <ul>
                                <li>Aberturas de aluminio Divanni, con guarda de materiales por tiempo indeterminado</li>
                                <li>Alinea tu alimentación y mejora tu rendimiento deportivo con Camila Sabatini, nutricionista de nuestro staff</li>
                            </ul> 
                        </div>

                    </div>
                </div>`
            })
            
        } catch (error) {
            console.log(error)
        }

    }



}
