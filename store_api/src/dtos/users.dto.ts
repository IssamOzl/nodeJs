import { activeOrNot } from "./global.dto"
// master = admin  - user = confirmation - delivery : shipping ( will be added soon)
type user_type = "master"|"user"|"delivery"

 export interface user{
    "user_id"       : number
    "user_email"    : string
    "user_name"     : string
    "user_password" : string
    "user_status"   : activeOrNot
    "user_type"     : user_type
    "api_key"       : string
    "host"          : string
    "usage_count"   : number
    "usage_date"    : Date
}

export interface userIdParam{
    "user_id":number
    "host":string
}