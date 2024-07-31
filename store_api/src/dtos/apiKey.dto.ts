export interface countKeysExists{
    "count_keys":number
}
export interface updateQueryRes{
    "affectedRows":number
}
export interface apiKey{
    "api_key":string
    "usage_date":Date
    "usage_count":number
    "host":string
}