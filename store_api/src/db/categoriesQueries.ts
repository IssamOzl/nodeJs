import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import { pool } from './conn'
import { categories } from '../dtos/categories.dto';


export const find = async (all: boolean = true) => {
    try {
        let QUERY;
        if (all) {
            QUERY = "SELECT * FROM category where 1"
        } else {
            QUERY = "SELECT * FROM `category` WHERE `category_id` in (SELECT category_id from  product where product_quantity > 0)  and `category_status`='active'"
        }
        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY)
        client.release();
        const cats: categories[] = rows as categories[]
        return cats
    } catch (error) {
        throw error
    }
}

export const findById = async (id: number = 0) => {
    try {

        let QUERY = "SELECT * FROM `category` WHERE `category_id` = ?";
        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY, [id])
        client.release();
        const cats: categories[] = rows as categories[]
        return cats[0]

    } catch (error) {
        throw error
    }
}