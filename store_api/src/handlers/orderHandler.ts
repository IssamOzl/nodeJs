import { Request, Response, NextFunction } from 'express';
import { order } from '../dtos/orders.dto';
import { add } from '../db/ordersQueries';

export async function place_order(request:Request<{},{},order>,response:Response) {
    try {
        const orderInfos:order = request.body
        console.log(orderInfos);
        const insertId = await add(orderInfos)

        return response.status(201).send(insertId)
    } catch (error) {
        return response.status(500)
    }
}