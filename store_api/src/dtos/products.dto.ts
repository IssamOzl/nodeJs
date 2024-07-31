import { productReview } from "./reviews.dto"

type activeOrNot= "active"|"inactive"


export interface product{
    "product_id": number
    "brand_id" : number
    "category_id":number
    "free_shipping": number
    "old_price": number
    "product_base_price": number
    "product_date":Date
    "product_description":string
    "product_enter_by": number
    "product_minimum_order": number
    "product_name": string
    //"product_quantity": number
    "product_status":activeOrNot
    "product_tax": number
    "product_unit":string
    "slug":string
    "note"?:number
    "comments_count"?:number
    "images"?:productImage[]
    "reviews"?:productReview[]
    "thumbnail"?:string
    "variations"?:productVariations[]
}
export interface productImage{
    "id_image":number
    "name_image":string
    "id_product":number
}
export interface productThumb{
    "name_image":string
}
export interface productVariations{
    "id":number
    "name":string
    "status":activeOrNot
    "stock":number
    "placement":string
}


export interface productsResponseWithCount{
    "products":product[]
    "count":number
}
export interface get_products_by_category_request{
    "category_id":number
    "limit":number
    "offset":number
}
export interface get_all_products_request{
    "limit":number
    "offset":number
}
export interface get_product_details_request{
    "slug":string
}