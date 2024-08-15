import { ValidationError } from "express-validator"

export interface countKeysExists{
    "count_keys":number
}
export interface updateQueryRes{
    "affectedRows":number
}
export type activeOrNot= "active"|"inactive"
export interface validationErrorArray{
     "Errors":ValidationError[]
}