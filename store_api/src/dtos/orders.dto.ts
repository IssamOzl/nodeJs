export interface order{
    "coupon" :string
    "order_address" :string
    "order_created_date" :Date
    "order_date" :Date
    "order_id" :number
    "order_name" :string
    "order_phone" :string
    "order_shipping" :string
    "order_shipping_city" :number
    "order_shipping_cost" :number
    "order_shipping_id" :number
    "order_status" :string
    "order_total" :number
    "order_tracking" :string
    "payment_status" :'cash'|'credit'
    "user_id" :number
    "products":order_product[]
    
}

interface order_product{
    id_variation :number
    inventory_order_id :number
    inventory_order_product_id :number
    price :number
    product_id :number
    quantity :number
    tax :number
}