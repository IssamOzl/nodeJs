export interface params{
    "phone"             : string
    "email"             : string
    "fb_link"           : string
    "logo_link"         : string
    "logo_etiq_link"    : string
    "order_id_prefix"   : string
    "site_name"         : string
    "whats_number"      : string
    "main_color"        : string
    "second_color"      : string
    "main_color_dark"   : string
    "second_color_dark" : string
    "fb_pixel"          : string
}

export interface getParamByName{
    name:string
}
export interface getParamByNameVal{
    value:string
}