import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { error } from 'console';
import { Item } from 'src/app/entities/items.entity';

import { MercadopagoService } from 'src/app/services/mercadopago/mercadopago.service';



@Crud({
    model: { type: Item }
})

@Controller('mercadopago')
export class MercadopagoController {

    constructor(
        private readonly service: MercadopagoService,
        ){}

    @Post('create-preference')
    async createPaymentPreference(@Res() res, @Body() body) {
        const item: Item = {
            id: body.id,
            category_id: body.category_id,
            currency_id: body.currency_id,
            description: body.description,
            title: body.title,
            quantity: body.quantity,
            unit_price: body.unit_price,
            createdAt: body.createdAt,
            updatedAt: body.updatedAt
        }

        const id: string = body.user_id

        this.service.paymentPreference(res, item, id)
    }

    mercadopago = require('mercadopago')

    @Post('notification')
    async notification(@Req() req, @Res() res) {
        console.log('Body de la notificacion');
        console.log(req.body)
        
        if(req.body.topic === 'merchant_order'){
            const url = req.body.resource
            const data = await this.service.fetchMerchantOrder(url)
            
            const reference = data.title
            if(data.status === 'approved'){
                this.service.fetchRunners().then(async (response) =>  {
                    for (let i = 0; i < response.data.length; i++) {
                        var e = response.data[i];
                        if(e.preference_id === reference){
                            if(e.status !== 'approved'){
                                e.merchant_order_id = data.merchant_order_id
                                e.status = data.status 
                                e.payment_id = data.payment_id
                                await this.service.updateRunner(e.id, e).then( async () => {
                                    if(e.mailSent !== null && e.mailSent === true){
                                        await this.service.sendMail(e.email, e.name, e.catValue, e.runnerNumber, true, e.paymentStatusCheckUrl).then( async () => {
                                            e.mailSent = true
                                            await this.service.updateRunner(e.id, e)  
                                        })
                                        return
                                    }
                                    else {
                                        await this.service.sendMail(e.email, e.name, e.catValue, e.runnerNumber, true, e.paymentStatusCheckUrl).then( async () => {
                                            e.mailSent = true
                                            await this.service.updateRunner(e.id, e)  
                                        })
                                    }
                                })
                                res.json({status: data.status, payment_id: data.payment_id, runnerId: e.id, reference: reference})
                                res.status(200)
                            }

                            else {
                                await this.service.updateRunner(e.id, e).then( async () => {
                                    if(e.mailSent !== null || e.mailSent === true){
                                        return
                                    }
                                    else {
                                        await this.service.sendMail(e.email, e.name, e.catValue, e.runnerNumber, false, e.paymentStatusCheckUrl).then( async () => {
                                            e.mailSent = true
                                            await this.service.updateRunner(e.id, e)  
                                        })
                                    }
                                })

                            }

                            break
                        }
                    }  
                })                           
            }
            else {
                console.log('payment no es approved');
                res.json({status: "not approved", payment_id: data.payment_id, reference})
                res.status(200)  
            }

        }

        else if(req.body.data != undefined){
            const data = await this.service.fetchData(req.body.data.id)
                //console.log(`fetch data devolvio: ${JSON.stringify(data)}`)
                if(data !== undefined) {
                    //console.log(`Data no es undefined, es: ${JSON.stringify(data)}`);
                    
                    if(data.description) {
                        const payment = {
                            card: data.card,
                            collector_id: data.collector_id,
                            date_approved: data.date_approved,
                            date_created: data.date_created,
                            description: data.description,
                            id: data.id,
                            money_release_date: data.money_release_date,
                            order: data.order,
                            payer: data.payer,
                            payment_method: data.payment_method,
                            statement_description: data.statement_description,
                            status: data.status,
                            status_detail: data.status_detail,
                            transaction_amount: data.transaction_amount
                        }
            
                        const reference = payment.description
                        if(payment.status === 'approved'){
                            this.service.fetchRunners().then((response) => {
                                for (let i = 0; i < response.data.length; i++) {
                                    var e = response.data[i];
                                    if(e.preference_id === reference){
                                        e.status = payment.status 
                                        e.payment_id = payment.id
                                        this.service.updateRunner(e.id, e).then(() => {
                                            this.service.sendMail(e.email, e.name, e.catValue, e.runnerNumber, true)
                                        })
                                        res.status(200)
                                        break
                                    }
                                }  
                            })                           
                        }
                        else {
                            //console.log('payment no es approved');
                            res.json({status: "pending", reference})
                            res.status(200)
                            
                        }
                        
                    }
                    else {
                        console.log('DATA DESCRIPTION NO EXISTE');   
                    }
                }
                else {
                    console.log('data no existe')
                    
                }
            res.status(200)
        }
        else {
            console.log('req.body.data es undefined');
            res.status(404)
        }
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