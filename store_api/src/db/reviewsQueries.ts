import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { productReview, reviewImages } from '../dtos/reviews.dto'

export const review_images = async (id:number)=>{
    try {
        const QUERY = "SELECT * FROM `review_images` where `review_id` = ?"
        const client = await pool.getConnection()
        const [rows,fields] = await client.execute(QUERY,[id])
        client.release()

        const images:reviewImages[] = rows as reviewImages[]
        return images
    } catch (error) {
        throw error
    }
}

export const prod_Reviews = async(slug:string)=>{
    try {
        const QUERY = "SELECT * FROM `product_reviews` JOIN product on product.product_id = product_reviews.product_id WHERE product.slug = ? and product_reviews.review_status = 1 ORDER by `review_id`"
        const client = await pool.getConnection()
        const [rows,fields] = await pool.execute(QUERY,[slug])
        client.release()

        const reviews:productReview[] = rows as productReview[]
        reviews.forEach( async (review : productReview,index)=>{
            const images:reviewImages[] =  await review_images(review.review_id) as reviewImages[] 
            reviews[index].review_images = images
        })

        return reviews

    } catch (error) {
        throw error
    }
}