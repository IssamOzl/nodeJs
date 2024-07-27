export interface productReview{
    "product_id":number
    "review_author":string
    "review_date":Date
    "review_description":string
    "review_id":number
    "review_note":number
    "review_status":0|1
    "review_images"?:reviewImages[]
}
export interface reviewImages{
    "id":number
    "review_id":number
    "review_image_path":string
}