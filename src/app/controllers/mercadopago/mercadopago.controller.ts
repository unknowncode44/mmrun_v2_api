import { Body, Controller, Post, Req, Res, Get } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Item } from 'src/app/entities/items.entity';
import axios from 'axios';
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

        console.log(`ID: ${id}`);
        

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
                try {
                    this.service.fetchRunners().then( async (response) =>  {
                        for (let i = 0; i < response.data.length; i++) {
                            var e = response.data[i];
                            if(e.preference_id === reference){
                                if(e.status !== 'approved'){
                                    e.merchant_order_id = data.merchant_order_id
                                    e.status = data.status 
                                    e.payment_id = data.payment_id
                                    if(e.runnerNumber !== e.id.toString()) {
                                        e.runnerNumber = e.id.toString()
                                        console.info(`[Info] Updated RunnerNumber of ${e.id}`)
                                    }
                                    await this.service.updateRunner(e.id, e).then( async () => {
                                        if(e.mailSent !== null && e.mailSent === true){
                                            await this.service.sendMail(e.email, e.name, e.catValue, e.id.toString(), true, e.paymentStatusCheckUrl)
                                            .then( async () => {
                                                await this.service.sendMail('tomas.decaboteau@gmail.com', e.name, e.catValue, e.id.toString(), true, e.paymentStatusCheckUrl)
                                                console.info(`[Info] Email Sent to ${e.email}`)
                                                e.mailSent = true
                                                await this.service.updateRunner(e.id, e)  
                                            })
                                            return
                                        }
                                        else {
                                            await this.service.sendMail(e.email, e.name, e.catValue, e.id.toString(), true, e.paymentStatusCheckUrl)
                                            .then(async () => {
                                                await this.service.sendMail('tomas.decaboteau@gmail.com', e.name, e.catValue, e.id.toString(), true, e.paymentStatusCheckUrl)
                                                console.info(`[Info] Email Sent to ${e.email}`)
                                                e.mailSent = true
                                                await this.service.updateRunner(e.id, e)  
                                            })
                                        }
                                    })
                                    res.json({status: data.status, payment_id: data.payment_id, runnerId: e.id, reference: reference})
                                    res.status(200)
                                }
    
                                else {
                                    this.service.updateRunner(e.id, e).then( async () => {
                                        if(e.mailSent !== null || e.mailSent === true){
                                            return
                                        }
                                        else {
                                            await this.service.sendMail(e.email, e.name, e.catValue, e.id.toString(), false, e.paymentStatusCheckUrl)
                                            .then( async () => {
                                                await this.service.sendMail('tomas.decaboteau@gmail.com', e.name, e.catValue, e.id.toString(), true, e.paymentStatusCheckUrl)
                                                console.info(`[Info] Email Sent to ${e.email}`)
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
                } catch (error) {
                    console.log(error)
                }                          
            }
            else {
                console.log('payment no es approved');
                res.json({status: "not approved", payment_id: data.payment_id, reference})
                res.status(200)  
            }

        }

        else if(req.body.data != undefined){
            try {
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
                        this.service.fetchRunners().then( async (response) => {
                            for (let i = 0; i < response.data.length; i++) {
                                var e = response.data[i];
                                if(e.preference_id === reference){
                                    e.status = payment.status 
                                    e.payment_id = payment.id
                                    if(e.runnerNumber !== e.id.toString()) {
                                        e.runnerNumber = e.id.toString()
                                        await this.service.updateRunner(e.id, e).then(() => {
                                            console.info(`[Info] Updated RunnerNumber of ${e.id}`)
                                        })                                            
                                    }
                                    if(e.mailSent === false || e.mailSent === null) {
                                        e.mailSent = true
                                        this.service.updateRunner(e.id, e).then( async () => {
                                            await this.service.sendMail(e.email, e.name, e.catValue, e.id.toString(), true)
                                            .then( async () => {
                                                await this.service.sendMail('tomas.decaboteau@gmail.com', e.name, e.catValue, e.id.toString(), true)
                                                console.info(`[Info] Email Sent to ${e.email}`)
                                                e.mailSent = true
                                                await this.service.updateRunner(e.id, e)
                                            })
                                        })
                                    }
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
                
            } catch (error) {
                console.log(error)
            }
        }
        else {
            console.log('req.body.data es undefined');
            res.status(404)
        }
    }


    @Post('walk')
    async sendWalkMail(@Req() req, @Body() Body, @Res() res){
        try {
            await this.service.sendMailWalk(req.body.email, req.body.name, 'A confirmar').then( async () => {
                await this.service.sendMailWalk('tomas.decaboteau@gmail.com', req.body.name, 'A confirmar' )
                console.info(`[Info] Email Sent to ${req.body.email}`)
                res.json({status: `Email Sent to ${req.body.email}`})
                res.status(200)
            })
        } catch (error) {
            console.error(error)
            res.status(500)  
        }

    }

    @Post('sendnewmail')
    async sendNewMail(@Req() req, @Body() body, @Res() res){
        try {
            await this.service.sendMail(req.body.email, req.body.name, req.body.distance, req.body.runnerNumber, req.body.approved).then( () => {
                console.info(`[Info] Email Sent to ${req.body.email}`)
                res.json({status: `Email Sent to ${req.body.email}`})
                res.status(200)
            })
        }
        catch (error) {
            console.error(`Error al enviar el mail a ${req.body.email} error:  ${error}`)
            res.status(500)
        }
    }

    @Post('synchronize')
    async synchronize(@Req() req, @Res() res){
        console.log('llego solicitud');
        let preferences = []
        let matches = 0
        let offset = 0
        let report = []
        const date_from = req.body.date_from
        try {
            for (let index = 0; index < 500; index + 50) {
                await this.service.fetchPayments(offset.toString())
                .then( async (data) => {
                    console.log(`Total datos: ${data.length}`);
                    for (let i = 0; i < data.length; i++) {
                        const e = data[i];
                        if(e.payments.length > 0) {
                            let obj = {
                                pref_id: e.id,
                                title: e.items[0].title,
                                status: e.order_status,
                                payment_id: e.payments[0].id,
                                payment_amount: e.payments[0].transaction_amount,
                                payment_status: e.payments[0].status,
                                payment_status_detail: e.payments[0].status_detail,
                                payment_approved_date: e.payments[0].date_created,
                            }
                            preferences.push(obj)
                        }
                        else {
                            let obj = {
                                pref_id: e.id,
                                title: e.items[0].title,
                                status: e.order_status,
                                payment_id: null,
                                payment_amount: null,
                                payment_status: null,
                                payment_status_detail: null,
                                payment_approved_date: null,
                            }
                            preferences.push(obj)
                        }
                    }
                })
                offset = offset + 50   
                console.log(`preferencias: ${preferences.length}`);
                if(preferences.length > 500) {
                    break
                }  
            }

            console.log('sali del for')
            console.log(`Total Datos Recogidos: ${preferences.length}`)

            await axios.get('https://api.mmrun.com.ar/runners').then(
                    (runners) => {    
                        for (let i = 0; i < runners.data.length; i++) {
                            const runner = runners.data[i];
                            for (let i = 0; i < preferences.length; i++) {
                                const pref = preferences[i];
                                if(pref.title === runner.preference_id) {
                                    matches++
                                    let z = {
                                        pref_id                 : pref.pref_id,
                                        title                   : pref.title,
                                        status                  : pref.status,
                                        payment_id              : pref.payment_id,
                                        payment_amount          : pref.payment_amount,
                                        payment_status          : pref.payment_status,
                                        payment_status_detail   : pref.payment_status_detail,
                                        payment_approved_date   : pref.payment_approved_date,
                                        runnerId                : runner.id,
                                        runnerNumber            : runner.runnerNumber,
                                        runnerName              : runner.name,
                                        runnerCirc              : runner.catValue,
                                        runnerEmail             : runner.email,
                                        runnerStatus            : runner.status,
                                        runnerPaymentAmount     : runner.payment_amount,
                                        runnerDiscount          : runner.discountText
                                    }
                                    report.push(z)
                                }
                            }
                        }
                        console.log(matches);
                        
                        res.json({
                            data: report,
                        })
                        res.status(200)
                    }
                ) 

            
            
        }
        catch (error) {
            res.status(500)
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