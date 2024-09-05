import { Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'

import dotenv from 'dotenv';
dotenv.config();
const MAX_REQ_BY_IP:number = process.env.MAX_REQ_BY_IP as unknown as number
const MAX_REQ_BY_IP_ADD_ORDER:number = process.env.MAX_REQ_BY_IP_ADD_ORDER as unknown as number

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: MAX_REQ_BY_IP, // Limit each IP to 30 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	skip: (req, res) =>  req.url == "/api/v1/orders/add",
})
export const placeOrderlimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: MAX_REQ_BY_IP_ADD_ORDER, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})