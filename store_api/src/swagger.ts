const options = 
{
    definition:
    {
        openapi:'3.0.0',
        info: 
        {
            title: "NodeJs Express + MySql API",
            description: `
            NodeJs Express + MySql API, documented with Swagger.
            Limitations:
                + ${process.env.MAX_REQ_NUM} requests daily per API key.
                + ${process.env.MAX_REQ_BY_IP} requests in 15 min by ip adress.
                + ${process.env.MAX_REQ_BY_IP_ADD_ORDER} requests to /orders/add in 15 min by ip.


            API KEY to test : 9246b75a-dccb-4f9a-b398-4e98dd92f03a
            Press Authorize button, and paste the api key.`,
            version: "1.0.0"
        },
        servers: [
          {
            url: "http://localhost:3001/api/v1/",
            description: 'Development server'
          },
        ],
        components:
        {
           schemas:
           {
                category:
                {
                    type:"object",
                    required:["categorie_id","categorie_name"],
                    properties:
                    {
                        categorie_id:
                        {
                            type:"number",
                            description:"The id of categorie, auto-increment in db."
                        },
                        categorie_name:
                        {
                            type:"string",
                            description:"The name of categorie."

                        },
                        categorie_status:
                        {
                            type:"active | inactive",
                            description:"The status of categorie."

                        }
                    }
                },
                product:
                {
                    type:"object",
                    required:["slug","product_base_price","product_name","slug","product_id","category_id","free_shipping"],
                    properties:
                    {
                        product_id:
                        {
                            type:"number",
                            description:"The id of the product, auto-increment in db."
                        },
                        brand_id:
                        {
                            type:"number",
                            description:"The id of the product brand."
                        },
                        category_id:
                        {
                            type:"number",
                            description:"The id of the product category."
                        },
                        free_shipping:
                        {
                            type:"0|1",
                            description:"If the product is shipped for free."
                        },
                        old_price:
                        {
                            type:"number",
                            description:"The old price to be shown in product page."
                        },
                        product_base_price:
                        {
                            type:"number",
                            description:"The price of product."
                        },
                        product_date:
                        {
                            type:"Date",
                            description:"The date the product added to db."
                        },
                        product_description:
                        {
                            type:"string",
                            description:"The description of product."
                        },
                        product_enter_by:
                        {
                            type:"number",
                            description:"The id of user who added the product in db."
                        },
                        product_minimum_order:
                        {
                            type:"number",
                            description:"The minimum number of units to be ordered ( by default = 1)."
                        },
                        product_name:
                        {
                            type:"string",
                            description:"The name of product."
                        },
                        product_status:
                        {
                            type:"active | inactive",
                            description:"The status of product."
                        },
                        product_tax:
                        {
                            type:"number",
                            description:"The tax applied to the product."
                        },
                        product_unit:
                        {
                            type:"string",
                            description:"The unit of mesure ex: box/bag ..."
                        },
                        slug:
                        {
                            type:"string",
                            description:"Unique string id of product."
                        },
                        note:
                        {
                            type:"number",
                            description:"Note of product based on reviews."
                        },
                        comments_count:
                        {
                            type:"number",
                            description:"Number of comments related to the product."
                        },
                        images:
                        {
                            type:"productImage[]",
                            description:"Images array of the product."
                        },
                        reviews:
                        {
                            type:"productReview[]",
                            description:"Reviews array of the product."
                        },
                        thumbnail:
                        {
                            type:"string",
                            description:"thumbnail images name of the product."
                        },
                        variations:
                        {
                            type:"productVariations[]",
                            description:"The product variations."
                        },

                    }
                },
                productImage:
                {
                    
                    type:"object",
                    required:["id_image","name_image","id_product"],
                    properties:
                    {
                        id_image:
                        {
                            type:"number",
                            description:"The id of image."
                        },
                        name_image:
                        {
                            type:"string",
                            description:"The name of image."
                        },
                        id_product:
                        {
                            type:"number",
                            description:"The product id."
                        }

                    }
                },
                productVariations:
                {
                    
                    type:"object",
                    required:["id","name","stock","id_produit"],
                    properties:
                    {
                        id:
                        {
                            type:"number",
                            description:"The id of variation."
                        },
                        name:
                        {
                            type:"string",
                            description:"The variation name."
                        },
                        status:
                        {
                            type:"active | inactive",
                            description:"The variation status."
                        },
                        stock:
                        {
                            type:"number",
                            description:"Number of units available."
                        },
                        placement:
                        {
                            type:"string",
                            description:"The placement ov variation ( in warehouse,box number ...)"
                        },
                        id_produit:
                        {
                            type:"number",
                            description:"The product id."
                        }

                    }
                },
                shippingCompany:
                {
                    type:"object",
                    required:["shipping_id","shipping_name"],
                    properties:
                    {
                        shipping_id:
                        {
                            type:"number",
                            description:"The id of shipping company, auto-increment in db."
                        },
                        shipping_name:
                        {
                            type:"string",
                            description:"The name of shipping company."

                        },
                        shipping_status:
                        {
                            type:"0 | 1",
                            description:"The status of shipping company."

                        }
                    }
                },
                user:
                {
                    type:"object",
                    required:["user_id","user_email","user_password","user_type","api_key"],
                    properties:
                    {
                        user_id:
                        {
                            type:"number",
                            description:"The id of user, auto-increment in db."
                        },
                        user_email:
                        {
                            type:"string",
                            description:"The email of user."

                        },
                        user_name:
                        {
                            type:"string",
                            description:"The user's username."

                        },
                        user_password:
                        {
                            type:"string",
                            description:"The user's password."

                        },
                        user_status:
                        {
                            type:"active | inactive",
                            description:"The status of product."

                        },
                        user_type:
                        {
                            type:"string",
                            description:"The type of user : admin,master,confirmation...."

                        },
                        api_key:
                        {
                            type:"string",
                            description:"The generated apiKey attached to the user."

                        },
                        host:
                        {
                            type:"string",
                            description:"Ip adress of user attached to apikey."

                        },
                        usage_count:
                        {
                            type:"number",
                            description:"Number of requests made during the usage_date."

                        },
                        usage_date:
                        {
                            type:"Date",
                            description:"Last request date."

                        }
                    }
                },
                order:
                {
                    type:"object",
                    required:["order_address","order_id","order_name","order_phone","order_shipping_city","order_shipping_city","products"],
                    properties:
                    {
                        coupon:
                        {
                            type:"string",
                            description:"Coupon code."
                        },
                        order_address:
                        {
                            type:"string",
                            description:"The customer's shipping adress."

                        },
                        order_created_date:
                        {
                            type:"Date",
                            description:"The date where the order was made."

                        },
                        order_date:
                        {
                            type:"Date",
                            description:"Shipping date, fromat : YYYY-MM-DD."

                        },
                        order_id:
                        {
                            type:"number",
                            description:"The order id, auto_increment in db."

                        },
                        order_name:
                        {
                            type:"string",
                            description:"The customer's name."

                        },
                        order_phone:
                        {
                            type:"string",
                            description:"The customer's phone number."

                        },
                        order_shipping:
                        {
                            type:"string",
                            description:"optional if not exist will be replaced by the default shipping company"

                        },
                        order_shipping_id:
                        {
                            type:"number",
                            description:"optional if not exist will be replaced by the default shipping company"

                        },
                        order_shipping_city:
                        {
                            type:"number",
                            description:"Id of shipping city."

                        },
                        order_shipping_cost:
                        {
                            type:"number",
                            description:"Shipping cost."

                        },
                        order_status:
                        {
                            type:"string",
                            description:"The order state : to_confirm | pending | annule | to_notify | encours | no_answer | livre | retour"

                        },
                        order_total:
                        {
                            type:"number",
                            description:"The total price."

                        },
                        order_tracking:
                        {
                            type:"number",
                            description:"The tracking number."

                        },
                        payment_status:
                        {
                            type:"cash | credit",
                            description:"The tpayment method."

                        },
                        user_id:
                        {
                            type:"number",
                            description:"The id of user who added the order ( null if the order made in website)."

                        },
                        products:
                        {
                            type:"order_product[]",
                            description:"The products attached to the order"

                        }
                    }
                    
                },
                order_product:
                {
                    type:"object",
                    required:["inventory_order_product_id","inventory_order_id","product_id","quantity","id_variation"],
                    properties:
                    {
                        inventory_order_product_id:
                        {
                            type:"number",
                            description:"The id, auto_inscrement in db."

                        },
                        id_variation:
                        {
                            type:"number",
                            description:"The product variation id."
                        },
                        inventory_order_id:
                        {
                            type:"number",
                            description:"The order id."

                        },
                        price:
                        {
                            type:"number",
                            description:"Price of the product."

                        },
                        product_id:
                        {
                            type:"number",
                            description:"The id of product."

                        },
                        quantity:
                        {
                            type:"number",
                            description:"The quantity to order."

                        },
                        tax:
                        {
                            type:"number",
                            description:"The tax amount related to the product"

                        }
                    }
                },
                shippingCity:
                {
                    type:"object",
                    required:["id","name","shupping_cost"],
                    properties:
                    {
                        id:
                        {
                            type:"number",
                            description:"The id of shipping city, auto-increment in db."
                        },
                        name:
                        {
                            type:"string",
                            description:"The name of shipping city."

                        },
                        shupping_cost:
                        {
                            type:"number",
                            description:"The cost of shipping."

                        }
                    }
                },
                params:{
                    type:"object",
                    properties:
                    {
                        phone:
                        {
                            type:"string",
                            description:"Shop's Main phone  number."
                        },
                        email:
                        {
                            type:"string",
                            description:"Shop's support email."
                        },
                        fb_link:
                        {
                            type:"string",
                            description:"Facebook page link."
                        },
                        logo_link:
                        {
                            type:"string",
                            description:"Main logo of the shop image name."
                        },
                        logo_etiq_link:
                        {
                            type:"string",
                            description:"Tickets logo image name."
                        },
                        order_id_prefix:
                        {
                            type:"string",
                            description:"Short prefix to identify orders."
                        },
                        site_name:
                        {
                            type:"string",
                            description:"Main shop name."
                        },
                        whats_number:
                        {
                            type:"string",
                            description:"Main shop's whatsapp number."
                        },
                        main_color:
                        {
                            type:"string",
                            description:"Main css color of the shop."
                        },
                        second_color:
                        {
                            type:"string",
                            description:"Second css color of the shop."
                        },
                        main_color_dark:
                        {
                            type:"string",
                            description:"Main css dark color of the shop."
                        },
                        second_color_dark:
                        {
                            type:"string",
                            description:"Second css dark color of the shop."
                        },
                        fb_pixel:
                        {
                            type:"string",
                            description:"Facebook pixel."
                        },
                    }

                }
           },
           responses:
           {
                401:
                {
                    description:"Not authorized or daily limit reached.",
                    contents:"application/json"
                },
                400:
                {
                    description:"Bad Request.",
                    contents:"application/json"
                }, 
                500:
                {
                    description:"Internal Server Error.",
                    contents:"application/json"
                }, 
                404:
                {
                    description:"Resource not found.",
                    contents:"application/json"
                },
                201:
                {
                    description:"Added succefully.",
                    contents:"application/json"
                },
                200:
                {
                    description:"Ssucceful request.",
                    contents:"application/json"
                },
           } ,
           securitySchemes: {
               ApiKeyAuth: {
                   type: 'apiKey',
                   in: 'header',
                   name: 'x-api-key'
               }
             }
        },
        security: [{
          ApiKeyAuth: []
        }]
          
    },
    apis:[
            './src/routes/categoriesRoute.ts',
            './src/routes/orderRoute.ts',
            './src/routes/paramsRoute.ts',
            './src/routes/productsRoute.ts',
            './src/routes/shippingCitiesRoute.ts',
            './src/routes/shippingCompaniesRoute.ts'
        ]
}

module.exports = options