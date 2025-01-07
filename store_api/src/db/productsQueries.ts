import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import { pool } from './conn'
import { prodBasePriceShipping, product, productImage, productThumb, productVariations } from '../dtos/products.dto';
import { productReview } from '../dtos/reviews.dto';
import { prod_Reviews } from './reviewsQueries';

const thumbnail = ""

const product_thumb_name = async (slug: string) => {
    try {
        console.log("product_thumb_name called" );
        let QUERY = "SELECT `name_image`  FROM `product_images` WHERE `id_product` = (SELECT product_id FROM product WHERE slug = ? LIMIT 1) and `name_image` LIKE '%mini%' LIMIT 1"
        const client = await pool.getConnection()
        console.log(QUERY);
        const [rows, fields] = await client.query(QUERY, [slug])
        pool.releaseConnection(client)
        client.release();
        const thumb: productThumb[] = rows as productThumb[]
        console.log("product_thumb_name resolve",thumb[0]);
        return thumb[0]

    } catch (error) {
        throw error
    }
}

const product_images = async (slug: string) => {
    try {
        const QUERY = "SELECT * FROM `product_images` WHERE `id_product` = (SELECT product_id FROM product WHERE slug = ? LIMIT 1) and `name_image` NOT LIKE '%mini%' order by name_image "
        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY, [slug])
        pool.releaseConnection(client)
        client.release()
        const images: productImage[] = rows as productImage[]
        
        console.log("product_images resolve",images);
        return images
    } catch (error) {
        throw error
    }
}

const stock_product = async (slug: string) => {
    try {
        console.log("stock_product called");
        //const QUERY = "SELECT id,name,status,stock,placement FROM `product_variations` WHERE `status`='active' AND `id_produit` in (select `product_id` from product where slug = 	?)"
        const QUERY = "SELECT id,name,status,stock,placement FROM `product_variations` inner join product on product.product_id = product_variations.id_produit WHERE `status`='active' AND product.slug =  '"+slug+"';"
        
        console.log(QUERY);
        console.log(slug);
         const client = await pool.getConnection()
        //console.log("getConnection");
        const [rows, fields] = await client.query(QUERY )
        console.log("await pool.query");
        const variations: productVariations[] = rows as productVariations[]

        console.log("stock_product resolve",variations);
        pool.releaseConnection(client)
        client.release()
        return variations
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const latest_ten_prods = async () => {
    try {


        let QUERY = "SELECT prd.* ,product_images.name_image as thumbnail FROM product as prd inner join `product_images` on product_images.id_product = prd.product_id and product_images.name_image like '%mini%' WHERE prd.product_status ='active' and prd.product_id in ( SELECT `id_produit` FROM `product_variations` WHERE `status` = 'active' and stock >0 ) order by `product_id` DESC LIMIT 12;"
        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY)
        pool.releaseConnection(client)
        client.release()
        const prods: product[] = rows as product[]

        return prods
    } catch (error) {
        throw error
    }
}

export const prods_by_category = async (categorie_id: number = -1, limit: number = -1, offset: number = -1, all: boolean = true) => {
    if (categorie_id != -1) {
        try {
            let QUERY: string = "SELECT prd.*,product_images.name_image as thumbnail FROM product as prd inner join `product_images` on product_images.id_product = prd.product_id and product_images.name_image like '%mini%' and  category_id = ? ";

            // active products only
            if (!all) {
                QUERY += "and prd.product_status ='active' and prd.product_id in (SELECT `id_produit` FROM `product_variations` WHERE `status` = 'active' and stock >0 )  order by `product_id` DESC "
            }
            if (limit <= -1) {
                limit = 0
            }
            QUERY += "LIMIT " + limit

            if (offset <= -1) {
                offset = 0
            }

            QUERY += " OFFSET " + offset

            const client = await pool.getConnection()
            const [rows, fields] = await client.query(QUERY, [categorie_id])
            pool.releaseConnection(client)
            client.release();
            const prods: product[] = rows as product[]
            return prods
        } catch (error) {
            throw error
        }
    } else {
        throw new Error("Invalid category id")
    }


}

export const all_prods = async (limit: number = -1, offset: number = -1, all: boolean = true) => {
    try {
        let QUERY: string = "SELECT prd.* ,product_images.name_image as thumbnail  FROM product as prd inner join `product_images` on product_images.id_product = prd.product_id and product_images.name_image like '%mini%' ";

        // active products only
        if (!all) {
            QUERY += "where prd.product_status ='active' and prd.product_id in (SELECT `id_produit` FROM `product_variations` WHERE `status` = 'active' and stock >0 )  order by `product_id` DESC "
        }
        if (limit <= -1) {
            limit = 0
        }
        QUERY += "LIMIT " + limit

        if (offset <= -1) {
            offset = 0
        }
        QUERY += " OFFSET " + offset

        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY)
        pool.releaseConnection(client)
        client.release();
        const prods: product[] = rows as product[]
        return prods
    } catch (error) {
        throw error
    }


}


export const prod_details = async (slug: string) => {
    try {
        // slug is unique, only one value or 0 is returned

        const QUERY: string = "SELECT * FROM `product` where `product_status` ='active' and slug = ? limit 1"

        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY, [slug])
        const prods: product[] = rows as product[]
        if (prods.length > 0) {
            let prodPromises = []
            let images: productImage[]
            let reviews: productReview[]
            let variations: productVariations[]
            let thumb_name: productThumb

            


            console.log("await Promise");

            prodPromises.push(variations = await stock_product(slug))
            prodPromises.push(thumb_name = await product_thumb_name(slug))
            prodPromises.push(images = await product_images(slug))
           // prodPromises.push(reviews = await prod_Reviews(slug))

            try {
                await Promise.all(prodPromises);
              } catch (error) {
                console.error(error);
              }

            console.log("got Promise");
            
            prods[0].thumbnail = thumb_name.name_image
            prods[0].images = images

            //prods[0].reviews = reviews

            prods[0].variations = variations

            //prods[0].comments_count = reviews.length
            let note: number = 0

           /* reviews.map((review: productReview, index: number) => {
                note += review.review_note
            });
            prods[0].note = note*/

        }
        pool.releaseConnection(client)
        client.release()
        return prods



    } catch (error) {
        throw error
    }
}

export const random_prods = async (slug: string, count: number) => {
    try {
        //'
        let QUERY = "SELECT prd.* ,product_images.name_image as thumbnail  FROM product as prd inner join `product_images` on product_images.id_product = prd.product_id and product_images.name_image like '%mini%' WHERE  prd.product_status ='active' and slug != ? and prd.product_id in (SELECT `id_produit` FROM `product_variations` WHERE `status` = 'active' and stock >0 ) ORDER BY rand() LIMIT ?"
        const client = await pool.getConnection()
        const [rows, fields] = await client.query(QUERY, [slug, count])
        pool.releaseConnection(client)
        client.release();
        const prods: product[] = rows as product[]
        return prods
    } catch (error) {
        throw error
    }
}

export const check_variation_stock = async (id_variation: number) => {
    try {
        let QUERY = "select  id,name,status,stock,placement,id_produit from product_variations where id=? "
        console.log("QUERY",QUERY);
        console.log("id_variation",id_variation);
        const client = await pool.getConnection()
        const rows: any = await client.query(QUERY, [id_variation])
        pool.releaseConnection(client)
        client.release();
        const vars: productVariations = rows[0][0] as productVariations
        return vars
    } catch (error) {
        throw error
    }
}

export const prod_base_price_shipping = async (id: number): Promise<prodBasePriceShipping> => {
    try {
        let QUERY = "select  product_base_price,free_shipping from product  where product_id=? "
        const client = await pool.getConnection()
        const rows: any = await client.query(QUERY, [id])
        pool.releaseConnection(client)
        client.release();
        const basePriceShipping: prodBasePriceShipping = rows[0][0] as prodBasePriceShipping
        return basePriceShipping
    } catch (error) {
        throw error
    }
}